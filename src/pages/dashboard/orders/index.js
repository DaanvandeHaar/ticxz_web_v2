import { useCallback, useEffect, useRef, useState } from 'react';
import Head from 'next/head';
import toast from 'react-hot-toast';
import {
  Box,
  Button,
  Divider,
  Grid,
  InputAdornment,
  Tab,
  Tabs,
  TextField,
  Typography
} from '@mui/material';
import { Layout as DashboardLayout } from '../../../layouts/dashboard';
import { styled } from '@mui/material/styles';
import {useDispatch, useSelector} from "../../../store";
import {useRouter} from "next/router";
import PlusIcon from "@untitled-ui/icons-react/build/esm/Plus";
import * as PropTypes from "prop-types";
import {OrderListTable} from "../../../components/order/order-list-table";
import {OrderDrawer} from "../../../components/order/order-drawer";
import {gtm} from "../../../libs/gtm";
import {getOrders} from "../../../slices/order";

const tabs = [
  {
    label: 'All',
    value: 'all'
  },
  {
    label: 'Pending',
    value: 0
  },
  {
    label: 'Complete',
    value: 1
  },
  {
    label: 'Failed',
    value: 2
  },
  {
    label: 'Refund',
    value: 3
  }
];

const sortOptions = [
  {
    label: 'Newest',
    value: 'desc'
  },
  {
    label: 'Oldest',
    value: 'asc'
  }
];

const applyFilters = (orders, filters) =>  orders.filter((order) => {
  if (filters.query) {
    const containsQuery = (order.orderId || '').toLowerCase().includes(filters.query.toLowerCase());

    if (!containsQuery) {
      return false;
    }
  }

  if (typeof filters.status !== 'undefined') {
    const statusMatched = order.status === filters.status;

    if (!statusMatched) {
      return false;
    }
  }

  return true;
});

const applySort = (orders, sortDir) => orders.sort((a, b) => {
  const comparator = a.orderDate > b.orderDate ? -1 : 1;

  return sortDir === 'desc' ? comparator : -comparator;
});

const applyPagination = (orders, page, rowsPerPage) => orders.slice(page * rowsPerPage,
    page * rowsPerPage + rowsPerPage);

const OrderListInner = styled('div',
    { shouldForwardProp: (prop) => prop !== 'open' })(
    ({ theme, open }) => ({
      flexGrow: 1,
      overflow: 'hidden',
      paddingBottom: theme.spacing(8),
      paddingTop: theme.spacing(8),
      zIndex: 1,
      [theme.breakpoints.up('lg')]: {
        marginRight: -500
      },
      transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen
      }),
      ...(open && {
        [theme.breakpoints.up('lg')]: {
          marginRight: 0
        },
        transition: theme.transitions.create('margin', {
          easing: theme.transitions.easing.easeOut,
          duration: theme.transitions.duration.enteringScreen
        })
      })
    }));

function SearchIcon(props) {
  return null;
}

SearchIcon.propTypes = {fontSize: PropTypes.string};
const Page = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const rootRef = useRef(null);
  const queryRef = useRef(null);
  const [currentTab, setCurrentTab] = useState('all');
  const [sort, setSort] = useState('desc');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [filters, setFilters] = useState({
    query: '',
    status: undefined
  });
  const [drawer, setDrawer] = useState({
    isOpen: false,
    orderId: undefined
  });

  const activeEvent = useSelector(state => state.event.activeEvent);
  const orders = useSelector(state => state.order.orders)

  useEffect(() => {
    gtm.push({ event: 'page_view' });
  }, []);


  useEffect(() => {
    const fetchOrders = async () => {
      if (Object.keys(activeEvent).length === 0) {
        toast.error('Select an event before viewing orders')
        await router.push('/dashboard')
        return
      }
      dispatch(getOrders(activeEvent.eventId))
    };
    fetchOrders().catch((err) => {
        console.log(err)
    });
  },[activeEvent])

  const handleTabsChange = (event, value) => {
    setCurrentTab(value);
    setFilters((prevState) => ({
      ...prevState,
      status: value === 'all' ? undefined : value
    }));
  };

  const handleQueryChange = (event) => {
    event.preventDefault();
    setFilters((prevState) => ({
      ...prevState,
      query: queryRef.current?.value
    }));
  };

  const handleSortChange = (event) => {
    const value = event.target.value;
    setSort(value);
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
  };

  const handleOpenDrawer = (orderId) => {
    setDrawer({
      isOpen: true,
      orderId
    });
  };

  const handleCloseDrawer = () => {
    setDrawer({
      isOpen: false,
      orderId: undefined
    });
  };

  // Usually query is done on backend with indexing solutions
  const filteredOrders = applyFilters(orders, filters);
  const sortedOrders = applySort(filteredOrders, sort);
  const paginatedOrders = applyPagination(sortedOrders, page, rowsPerPage);

  return (
      <>
        <Head>
          <title>
            Dashboard: Order List | Ticxz
          </title>
        </Head>
        <Box
            component="main"
            ref={rootRef}
            sx={{
              backgroundColor: 'background.paper',
              display: 'flex',
              flexGrow: 1,
              overflow: 'hidden'
            }}
        >
          <OrderListInner open={drawer.isOpen}>
            <Box sx={{ px: 3 }}>
              <Grid
                  container
                  justifyContent="space-between"
                  spacing={3}
              >
                <Grid item>
                  <Typography variant="h4">
                    Orders
                  </Typography>
                </Grid>
                <Grid item>
                  <Button
                      startIcon={<PlusIcon fontSize="small" />}
                      variant="contained"
                  >
                    Add
                  </Button>
                </Grid>
              </Grid>
              <Tabs
                  indicatorColor="primary"
                  onChange={handleTabsChange}
                  scrollButtons="auto"
                  textColor="primary"
                  value={currentTab}
                  sx={{ mt: 3 }}
                  variant="scrollable"
              >
                {tabs.map((tab) => (
                    <Tab
                        key={tab.value}
                        label={tab.label}
                        value={tab.value}
                    />
                ))}
              </Tabs>
            </Box>
            <Divider />
            <Box
                sx={{
                  alignItems: 'center',
                  display: 'flex',
                  flexWrap: 'wrap',
                  m: -1.5,
                  p: 3
                }}
            >
              <Box
                  component="form"
                  onSubmit={handleQueryChange}
                  sx={{
                    flexGrow: 1,
                    m: 1.5
                  }}
              >
                <TextField
                    defaultValue=""
                    fullWidth
                    inputProps={{ ref: queryRef }}
                    InputProps={{
                      startAdornment: (
                          <InputAdornment position="start">
                            <SearchIcon fontSize="small" />
                          </InputAdornment>
                      )
                    }}
                    placeholder="Search by order number"
                />
              </Box>
              <TextField
                  label="Sort By"
                  name="order"
                  onChange={handleSortChange}
                  select
                  SelectProps={{ native: true }}
                  sx={{ m: 1.5 }}
                  value={sort}
              >
                {sortOptions.map((option) => (
                    <option
                        key={option.value}
                        value={option.value}
                    >
                      {option.label}
                    </option>
                ))}
              </TextField>
            </Box>
            <Divider />
            <OrderListTable
                onOpenDrawer={handleOpenDrawer}
                onPageChange={handlePageChange}
                onRowsPerPageChange={handleRowsPerPageChange}
                orders={paginatedOrders}
                ordersCount={filteredOrders.length}
                page={page}
                rowsPerPage={rowsPerPage}
            />
          </OrderListInner>
          <OrderDrawer
              containerRef={rootRef}
              onClose={handleCloseDrawer}
              open={drawer.isOpen}
              order={orders.find((order) => order.orderId === drawer.orderId)}
          />
        </Box>
      </>
  );
};


Page.getLayout = (page) => (
    <DashboardLayout>
      {page}
    </DashboardLayout>
);

export default Page;
