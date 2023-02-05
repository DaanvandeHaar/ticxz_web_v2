import PropTypes from "prop-types";
import {Avatar, Box, Chip, Link, Stack, Typography} from "@mui/material";
import NextLink from "next/link";
import {paths} from "../../paths";
import {getInitials} from "../../utils/get-initials";
import {useEffect, useState} from "react";
import axios from "axios";
import sanitizeHtml from "sanitize-html-react";
import {format} from "date-fns";


export const EventHeader = (props) => {
    const { onBack, event, ...other } = props;

    const [logo, setLogo] = useState(null);


    const createMarkup = () => ({__html: sanitizeHtml(event.eventDescription)});

    useEffect(() => {
        if (event) {
            let suffix = new Date().getMilliseconds().toString();
            const logoURL = `http://localhost:8080/asset/logo/${event.eventId}?${suffix}`
            axios.get(logoURL).then(() => {
                setLogo(logoURL)
            }).catch(() => {
                setLogo(null)
            })
        }
    }, []);

    return (
        <>
            <Stack direction="row" spacing={2}>
                { logo && (
                    <Box width={55}>
                        <img src={logo} width={60}/>
                    </Box>
                )}
                <Stack variant="column">
                <Typography
                    variant="h5"
                >
                    {event.eventName}
                </Typography>
                    <Typography variant="caption">
                        {`${format(new Date(event.eventStartDate), 'dd-MM-yy  hh:mm')} - ${format(new Date(event.eventEndDate), 'dd-MM-yy  hh:mm')}`}
                    </Typography>
                </Stack>
            </Stack>
            <div style={{
                lineHeight : 1,
            }}
                 dangerouslySetInnerHTML={createMarkup()}>
            </div>
            <Stack
                alignItems="center"
                direction="row"
                flexWrap="wrap"
                spacing={2}
                sx={{ mt: 2 }}
            >
            </Stack>
        </>
    );
};

EventHeader.propTypes = {
    event: PropTypes.object.isRequired,
};