import Head from 'next/head';
import {
    Avatar,
    Box, Button,
    Card,
    CardContent, CardMedia,
    Container, Divider, IconButton, LinearProgress,
    Link,
    Stack,
    SvgIcon,
    Typography,
    Unstable_Grid2 as Grid
} from '@mui/material';
import {usePageView} from "../../hooks/use-page-view";
import {CheckoutForm} from "../../components/shop/checkout-form";
import {CheckoutSummary} from "../../components/shop/checkout-summary";
import {CheckoutBilling} from "../../sections/checkout/checkout-billing";
import NextLink from "next/link";
import {paths} from "../../paths";
import ArrowLeftIcon from "@untitled-ui/icons-react/build/esm/ArrowLeft";
import {TicketListTable} from "../../components/shop/ticket-list-table";
import {useMounted} from "../../hooks/use-mounted";
import {productsApi} from "../../api/products";
import {useCallback, useEffect, useRef, useState} from "react";
import useWebSocket, {ReadyState} from "react-use-websocket";
import axios from "axios";
import {EventHeader} from "../../components/shop/shop-header";
import {Skeleton} from "@mui/lab";
import * as PropTypes from "prop-types";
import {OrderSummary} from "../../components/shop/order-summary";
import {useRouter} from "next/router";

const ServerMessage = {
    ClientError: 1,
    AddedToBasket: 2,
    AddToBasketError : 3,
    RemovedFromBasket: 4,
    RemoveFromBasketError: 5,
    ClearedCart: 6,
    ClearCartError: 7,
    AppliedPromoCode: 8,
    ApplyPromoCodeError: 9,
    CreatedOrder: 10,
    CreateOrderError: 11,
    CreatedPaymentIntent: 12,
    CreatePaymentIntentError: 13,
    EventUpdated: 14,
    EventUpdateError: 15,
    MaxQueueError: 16,
}

const useProducts = (search) => {
    const isMounted = useMounted();
    const [state, setState] = useState({
        products: [],
        productsCount: 0
    });

    const getProducts = useCallback(async () => {
        try {
            const response = await productsApi.getProducts(search);

            if (isMounted()) {
                setState({
                    products: response.data,
                    productsCount: response.count
                });
            }
        } catch (err) {
            console.error(err);
        }
    }, [search, isMounted]);

    useEffect(() => {
            getProducts();
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [search]);

    return state;
};
const useSearch = () => {
    const [search, setSearch] = useState({
        filters: {
            name: undefined,
            category: [],
            status: [],
            inStock: undefined
        },
        page: 0,
        rowsPerPage: 5
    });

    return {
        search,
        updateSearch: setSearch
    };
};


export const EventShop = (props) => {
    const {event, basket, handleGoToCheckout, ...other} = props;
    return <>
        <Box mt={1}>
            <Grid
                container
            >
                <Grid
                    md={12}
                    xs={12}
                    sx={{pb : 3}}
                >
                    <Card variant="outlined">
                        {props.banner && (
                            <CardMedia
                                image={props.banner}
                                sx={{
                                    width: "100%",
                                    // Without height undefined it won't work
                                    height: undefined,
                                    aspectRatio: "100 / 30",
                                    objectFit: "cover"
                                }}
                            />
                        )}
                        <CardContent>
                            {props.event ? (
                                <div>
                                    <EventHeader event={props.event}/>
                                    <Divider sx={{width: "100%", maxWidth: 1600, paddingTop: 2}}/>
                                    <Typography variant="h6" sx={{mt: 2, paddingBottom: 2, paddingTop: 1}}>
                                        Tickets
                                    </Typography>
                                    <TicketListTable basket={basket}
                                                     ticketTypes={props.event.eventTicketTypes}
                                                     ticketTypesCount={props.event.eventTicketTypes.length}
                                                     onPageChange={props.onPageChange}
                                                     page={props.search.page}
                                                     rowsPerPage={props.search.rowsPerPage}
                                                     onAddTicketToBasket={props.onAddTicketToBasket}
                                                        onRemoveTicketFromBasket={props.onRemoveTicketFromBasket}
                                    />
                                </div>
                            ) : (
                                <Box sx={{width: "100%"}}>
                                    <Skeleton variant="rectangular" width="100%">
                                        <div style={{paddingTop: "57%"}}/>
                                    </Skeleton>
                                    <Stack spacing={2} direction="row" sx={{paddingTop: 3, paddingBottom: 3}}>
                                        <Skeleton variant="circular">
                                            <Avatar/>
                                        </Skeleton>
                                        <Skeleton width="100%">
                                            <Typography>.</Typography>
                                        </Skeleton>

                                    </Stack>
                                    <Skeleton sx={{padding: 2}}/>
                                    <Skeleton sx={{padding: 1}}/>
                                    <Skeleton sx={{padding: 1}}/>
                                </Box>
                            )}
                        </CardContent>
                    </Card>
                </Grid>
                <Grid
                    md={12}
                    xs={12}
                >
                    <OrderSummary basket={basket}
                                  handleGoToCheckout={handleGoToCheckout}
                    />
                </Grid>
            </Grid>
        </Box>
        </>
}

EventShop.propTypes = {
    banner: PropTypes.any,
    event: PropTypes.object,
    basket: PropTypes.object,
    handleGoToCheckout: PropTypes.func,
    onPageChange: PropTypes.func,
    search: PropTypes.shape({
        filters: PropTypes.shape({
            name: PropTypes.any,
            inStock: PropTypes.any,
            category: PropTypes.arrayOf(PropTypes.any),
            status: PropTypes.arrayOf(PropTypes.any)
        }), page: PropTypes.number, rowsPerPage: PropTypes.number
    }),
    onAddTicketToBasket: PropTypes.func,
    onRemoveTicketFromBasket: PropTypes.func
};

export const EventCheckout = (props) => {
    const {event, handleGoBack, ...other} = props;
    return <>
        <Stack spacing={3}>
            <div>
                <IconButton onClick={handleGoBack}>
                    <SvgIcon sx={{mr: 1}}>
                        <ArrowLeftIcon/>
                    </SvgIcon>
                    <Typography variant="subtitle2">
                        Back
                    </Typography>
                </IconButton>
            </div>
            <Typography variant="h3">
                Checkout
            </Typography>
        </Stack>
        <Box mt={6}>
            <Grid
                container
                spacing={6}
            >
                <Grid
                    md={7}
                    xs={12}
                >
                    <CheckoutForm/>
                </Grid>
                <Grid
                    md={5}
                    xs={12}
                >
                    <CheckoutSummary/>
                </Grid>
            </Grid>
        </Box>
    </>;
}

EventCheckout.propTypes = {
    event: PropTypes.any,
    basket: PropTypes.object,
    handleGoBack: PropTypes.func
};

const Page = () => {
    const isMounted = useMounted();
    const { search, updateSearch } = useSearch();
    const router = useRouter();
    const { products, productsCount } = useProducts(search);
    const [socketUrl, setSocketUrl] = useState(`wss://localhost:8090/test/a8d0fb0f-645c-4223-a222-b444cf5f47e5`);
    const [messageHistory, setMessageHistory] = useState([]);
    const [event, setEvent] = useState(null);
    const [basket, setBasket] = useState(null)
    const [banner, setBanner] = useState(null);
    const [checkout, setCheckout] = useState(false);
    const didUnmount = useRef(false);
    const { sendMessage,sendJsonMessage, lastMessage, readyState } = useWebSocket(socketUrl,   {
        shouldReconnect: (closeEvent) => {
            setBasket(null)
            return didUnmount.current === false;
        },
        reconnectAttempts: 10,
        reconnectInterval: 3000,
    });

    useEffect(() => {
        return () => {
            didUnmount.current = true;
        };
    }, []);

    useEffect(() => {
        router.beforePopState((cb) => {
            if (checkout) {
                setCheckout(false);
                return false;
            }
            return true;
        });
    }, [router, checkout]);
    const handleGoToCheckout = () => {
        window.scrollTo(0, 0)
        setCheckout(true);
    }
    
    const handleGoBack = () => {
        window.scrollTo(0, 0)
        setCheckout(false);
    }
    
    useEffect(() => {
        if (event) {
            let suffix = new Date().getMilliseconds().toString();
            const bannerURL = `http://localhost:8080/asset/banner/${event.eventId}?${suffix}`
            axios.get(bannerURL).then(() => {
                setBanner(bannerURL)
            }).catch(() => {
                setBanner(null)
            })
        }
    }, [event]);

    useEffect(() => {
        if (lastMessage !== null) {
            setMessageHistory((prev) => prev.concat(lastMessage));
            let jsonData = JSON.parse(lastMessage.data);
            console.log(jsonData);
            switch (jsonData.messageType) {
                case 14:
                    setEvent(jsonData.event);
                    break
                case 2:
                    setBasket(jsonData.basket);
                    break
                case 4:
                    setBasket(jsonData.basket);
                    break
                default:
                    console.log("Unknown message type")
                    break
            }
        }
    }, [lastMessage, setMessageHistory]);


    const handleClickChangeSocketUrl = useCallback(
        () => setSocketUrl(`wss://localhost:8090/test/${event.eventId}`),
        []
    );


    const handleClickAddTicketToBasketMessage = useCallback((ticketTypeId) => {
        sendJsonMessage({messageType: 1, ticketTypeId: ticketTypeId})
        },
        [sendJsonMessage]
    );
    
    const handleClickRemoveTicketFromBasketMessage = useCallback((ticketTypeId) => {
        sendJsonMessage({messageType: 2, ticketTypeId: ticketTypeId})
        },
        [sendJsonMessage]
    );

    const connectionStatus = {
        [ReadyState.CONNECTING]: 'Connecting',
        [ReadyState.OPEN]: 'Open',
        [ReadyState.CLOSING]: 'Closing',
        [ReadyState.CLOSED]: 'Closed',
        [ReadyState.UNINSTANTIATED]: 'Uninstantiated',
    }[readyState];

    usePageView();

    const handleFiltersChange = useCallback((filters) => {
        updateSearch((prevState) => ({
            ...prevState,
            filters
        }));
    }, [updateSearch]);

    const handlePageChange = useCallback((event, page) => {
        updateSearch((prevState) => ({
            ...prevState,
            page
        }));
    }, [updateSearch]);

    const handleRowsPerPageChange = useCallback((event) => {
        updateSearch((prevState) => ({
            ...prevState,
            rowsPerPage: parseInt(event.target.value, 10)
        }));
    }, [updateSearch]);

    return (
        <>
            <Head>
                <title>
                    Event: Checkout | Ticxz
                </title>
            </Head>
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    py: 1
                }}
            >
                <Container maxWidth="md">
                    <form>
                        {checkout ? (
                            <EventCheckout event={event} handleGoBack={handleGoBack}/>
                         ) : (
                            <EventShop banner={banner} basket={basket} event={event} onPageChange={handlePageChange} search={search}
                                       onAddTicketToBasket={handleClickAddTicketToBasketMessage} onRemoveTicketFromBasket={handleClickRemoveTicketFromBasketMessage} handleGoToCheckout={handleGoToCheckout}/>
                        )}
                    </form>
                </Container>
            </Box>
        </>
    );
};


export default Page;