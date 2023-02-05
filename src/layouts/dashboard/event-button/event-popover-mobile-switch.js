import {MenuItem, Popover, SvgIcon} from '@mui/material';
import {useDispatch, useSelector} from "react-redux";
import {useEffect} from "react";
import {getEvents, setActiveEvent} from "../../../slices/event";
import Divider from "@mui/material/Divider";
import NextLink from "next/link";
import {paths} from "../../../paths";
import PlusIcon from "@untitled-ui/icons-react/build/esm/Plus";
import ListItemText from "@mui/material/ListItemText";
import CalendarIcon from "@untitled-ui/icons-react/build/esm/Calendar";

export const EventPopoverMobileSwitch = (props) => {
    const { anchorEl, onChange, onClose, open = false, tenants, ...other } = props;

    const dispatch = useDispatch();

    const events = useSelector(state => state.event.events);

    useEffect(() => {
        async function dispatchEvents() {
            await dispatch(getEvents())
        }
        dispatchEvents()
            .catch((error) => {
                console.log(error)
            });
    }, []);


    const handleChange = async (event) => {
        dispatch(setActiveEvent(event));
        onClose?.();
    };

    return (
        <Popover
            anchorEl={anchorEl}
            anchorOrigin={{
                horizontal: 'right',
                vertical: 'bottom'
            }}
            disableScrollLock
            transformOrigin={{
                horizontal: 'right',
                vertical: 'top'
            }}
            keepMounted
            onClose={onClose}
            open={open}
            PaperProps={{ sx: { width: 180 } }}
            {...other}>
            {events.map((event) => (
                <MenuItem
                    key={event}
                    onClick={() => handleChange(event)}
                >
                    {event.eventName}
                </MenuItem>
            ))}
            <Divider/>
            <MenuItem
                component={NextLink}
                href={paths.dashboard.event.new}
            >
                <SvgIcon fontSize="small">
                    <PlusIcon />
                </SvgIcon>
                <ListItemText sx={{paddingLeft: 1}}> New Event</ListItemText>
            </MenuItem>
            <MenuItem
                component={NextLink}
                href={paths.dashboard.calendar}
            >
                <SvgIcon fontSize="small">
                    <CalendarIcon />
                </SvgIcon>
                <ListItemText sx={{paddingLeft: 1}}> Calendar</ListItemText>
            </MenuItem>
        </Popover>
    );
};