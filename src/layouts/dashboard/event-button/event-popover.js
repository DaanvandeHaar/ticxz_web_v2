import {MenuItem, Popover, SvgIcon} from '@mui/material';
import {useEffect} from "react";
import {useRouter} from 'next/router';
import Divider from "@mui/material/Divider";
import ListItemText from "@mui/material/ListItemText";
import {useDispatch, useSelector} from "react-redux";
import {getEvents, setActiveEvent} from "../../../slices/event";
import NextLink from "next/link";
import {paths} from "../../../paths";
import PlusIcon from "@untitled-ui/icons-react/build/esm/Plus";
import CalendarIcon from "@untitled-ui/icons-react/build/esm/Calendar";
import User01Icon from "@untitled-ui/icons-react/build/esm/User01";


export const EventPopover = (props) => {
    const {anchorEl, onClose, open, ...other} = props;
    const router = useRouter();
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
                horizontal: 'left',
                vertical: 'bottom'
            }}
            keepMounted
            onClose={onClose}
            open={!!open}
            PaperProps={{sx: {width: 248}}}
            transitionDuration={0}
            {...other}>
            {events && events.map((events) => (
                <MenuItem
                    key={events.eventId}
                    onClick={() => handleChange(events)}
                >
                    {events.eventName}
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
