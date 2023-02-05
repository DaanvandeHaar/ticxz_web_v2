import { useCallback, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import ChevronDownIcon from '@untitled-ui/icons-react/build/esm/ChevronDown';
import { Box, IconButton, Stack, SvgIcon, Typography } from '@mui/material';
import {TenantPopover} from "../tenant-switch/tenant-popover";
import {useSelector} from "react-redux";
import {EventPopoverMobileSwitch} from "./event-popover-mobile-switch";
import PlusIcon from "@untitled-ui/icons-react/build/esm/Plus";

const tenants = ['Devias', 'Acme Corp'];

export const EventPopoverMobile = (props) => {
    const anchorRef = useRef(null);
    const [openPopover, setOpenPopover] = useState(false);

    const handlePopoverOpen = useCallback(() => {
        setOpenPopover(true);
    }, []);

    const handlePopoverClose = useCallback(() => {
        setOpenPopover(false);
    }, []);

    const handleTenantChange = useCallback((tenant) => {
        setOpenPopover(false);
    }, []);

    const activeEvent = useSelector(state => state.event.activeEvent);

    return (
        <>
            <Stack
                alignItems="center"
                direction="row"
                spacing={2}
                {...props}>
                { activeEvent && Object.keys(activeEvent).length === 0  ? (
                    <Box sx={{ flexGrow: 1 }}>
                        <Typography
                            color="inherit"
                            variant="h6"
                        >
                            Select Event
                        </Typography>
                    </Box>
                ) : (
                    <Box sx={{ flexGrow: 1 }}>
                        <Typography
                            color="inherit"
                            variant="h6"
                        >
                            {activeEvent.eventName}
                        </Typography>
                        <Typography
                            color="neutral.400"
                            variant="body2"
                        >
                            {"tickets sold: " + activeEvent.ticketsSold}
                        </Typography>
                    </Box>
                )}
                <IconButton
                    onClick={handlePopoverOpen}
                    ref={anchorRef}
                >
                    <SvgIcon sx={{ fontSize: 16 }}>
                        <ChevronDownIcon />
                    </SvgIcon>
                </IconButton>
            </Stack>
            <EventPopoverMobileSwitch
                anchorEl={anchorRef.current}
                onChange={handleTenantChange}
                onClose={handlePopoverClose}
                open={openPopover}
                tenants={tenants}
            />
        </>
    );
};

EventPopoverMobile.propTypes = {
    // @ts-ignore
    sx: PropTypes.object
};
