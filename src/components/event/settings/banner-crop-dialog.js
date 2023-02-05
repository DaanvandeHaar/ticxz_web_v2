import {Fragment, useState} from 'react';
import PropTypes from 'prop-types';
import toast from 'react-hot-toast';
import debounce from 'lodash.debounce';
import {
    Box, Button, Card, CardContent,
    Dialog,
    Grid,
} from '@mui/material';
import ReactCrop from "react-image-crop";


export const BannerCropModal = (props) => {
    const {onClose, open, banner, crop, setCrop, src, setSrc, imgRef, setBanner,cropImage, ...other} = props;

    const [aspect, setAspect] = useState(100 / 30);

    return (
        <Dialog
            onClose={onClose}
            open={open}
            {...other}>
            <Grid container>
                <Grid
                    item
                >
                    <Card
                    >
                        <CardContent>
                            <Box>
                            <ReactCrop
                                src={src}
                                crop={crop}
                                aspect={aspect}
                                onChange={(c) => setCrop(c)}
                            >
                                <img src={src}
                                     ref={imgRef}
                                     style={{width: '100%', maxWidth:'600'}}
                                />

                            </ReactCrop>
                                <Box
                                    sx={{
                                        alignItems: 'center',
                                        display: 'flex',
                                        paddingTop: 2
                                    }}
                                >
                                    <Box sx={{ flexGrow: 1 }} />
                                    <Button
                                        color={'error'}
                                        onClick={onClose}
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        onClick={() => {setBanner(); onClose()}}
                                        sx={{ ml: 1 }}
                                        type="submit"
                                        variant="contained"
                                    >
                                        Update
                                    </Button>
                                </Box>
                                </Box>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Dialog>
    );
};

BannerCropModal.propTypes = {
    onClose: PropTypes.func,
    open: PropTypes.bool.isRequired,
    banner: PropTypes.any,
    crop: PropTypes.any,
    setCrop: PropTypes.any,
    image: PropTypes.any,
    setImage: PropTypes.any,
    src: PropTypes.any,
    setSrc: PropTypes.any,
    setBanner: PropTypes.func,
    cropImage: PropTypes.func
};

BannerCropModal.defaultProps = {
    open: false
};