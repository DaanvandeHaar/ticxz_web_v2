import PropTypes from 'prop-types';
import { toast } from 'react-hot-toast';
import { ListItemText, MenuItem, Popover, Typography } from '@mui/material';


export const LocationPopover = (props) => {
    const { anchorEl, onClose, open, locationArray, googleMapsApi, formik, handleSetFormLoading, handleSetFormLoaded, ...other } = props;

    const getKeyByValue = (object, value) => Object.keys(object).find(key => object[key] === value);

    const resetForm = () => {
        formik.setFieldValue('houseNumber', '');
        formik.setFieldValue('street', '');
        formik.setFieldValue('city', '');
        formik.setFieldValue('postalCode', '');
        formik.setFieldValue('state', '');
        formik.setFieldValue('country', '');
        formik.setFieldValue('lat', '')
        formik.setFieldValue('lng', '')
    }

    const handleClick =  (location) => {
        onClose?.();
        let request = {
            placeId: location.place_id,
            fields: ['address_component', 'geometry']
        };
        let map = new google.maps.Map(document.createElement('div'));
        let placesService = new googleMapsApi.places.PlacesService(map);
        placesService.getDetails(request,  (place, status) => {
            if (status === window.google.maps.places.PlacesServiceStatus.OK) {
                resetForm();
                console.log(place);
                console.log(place.geometry.location.lat(), place.geometry.location.lng())
                formik.setFieldValue( 'lat', place.geometry.location.lat() || '')
                formik.setFieldValue( 'lng', place.geometry.location.lng() || '')
                for (let i = 0; i < place.address_components.length; i++) {
                    for (let j = 0; j < place.address_components[i].types.length; j++) {
                        switch (place.address_components[i].types[j]) {
                            case 'street_number':
                                formik.setFieldValue('houseNumber', place.address_components[i].long_name);
                            case 'route':
                                formik.setFieldValue('street', place.address_components[i].long_name);
                            case 'locality':
                                formik.setFieldValue('city', place.address_components[i].long_name);
                            case 'administrative_area_level_1':
                                formik.setFieldValue('state', place.address_components[i].long_name);
                            case 'country':
                                formik.setFieldValue('country', place.address_components[i].long_name);
                            case 'postal_code':
                                formik.setFieldValue('postalCode', place.address_components[i].long_name);

                        }

                    }
                }
            }
        });
        }

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
            fullwidth
            transitionDuration={20}
            {...other}>
            {locationArray.map((location) => (
                <MenuItem
                    onClick={() => handleClick(location)}
                    key={location}
                >
                    <ListItemText
                        primary={(
                            <Typography variant="subtitle2">
                                {location.description}
                            </Typography>
                        )}
                    />
                </MenuItem>
            ))}
        </Popover>
    );
};

LocationPopover.propTypes = {
    anchorEl: PropTypes.any,
    onClose: PropTypes.func,
    open: PropTypes.bool,
    locationArray: PropTypes.array,
    googleMapsApi: PropTypes.object,
    formik: PropTypes.object,
    handleSetFormLoading: PropTypes.func,
    handleSetFormLoaded: PropTypes.func
};
