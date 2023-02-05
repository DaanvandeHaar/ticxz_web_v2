import {Box, Button, Card, CardContent, Grid, Stack, Typography} from '@mui/material';
import TextField from "@mui/material/TextField";
import {useCallback, useEffect, useRef, useState} from "react";
import PropTypes from "prop-types";
import {useSelector} from "../../../store";
import {FileDropzone} from "../../file-dropzone";
import {fileToBase64} from "../../../utils/file-to-base64";
import {BannerCropModal} from "./banner-crop-dialog";
import 'react-image-crop/dist/ReactCrop.css';
import toast from "react-hot-toast";
import axios from "axios";
import {assetApi} from "../../../api/asset";
import ColorPickerField from "../../color-picker-field";
import {ColorPicker} from "mui-color";
import {FileUploader} from "../../../sections/dashboard/file-manager/file-uploader";


export const EventStylingSettings = (props) => {
    const {formik, ...other} = props;

    const activeEvent = useSelector(state => state.event.activeEvent);
    const [logo, setLogo] = useState(null);
    const [banner, setBanner] = useState(null);
    const imgRef = useRef(null)
    const [crop, setCrop] = useState();
    const [src, setSrc] = useState(null);
    const [logoSrc, setLogoSrc] = useState(null);
    const [openLogoUploader, setOpenLogoUploader] = useState(false);
    const [openBannerUploader, setOpenBannerUploader] = useState(false);
    const [dialog, setDialog] = useState({
        isOpen: false,
        banner: null
    });


    useEffect(() => {
        let suffix = new Date().getMilliseconds().toString();
        const bannerURL = `http://localhost:8080/asset/banner/${activeEvent.eventId}?${suffix}`
        axios.get(bannerURL).then(() => {
            setBanner(bannerURL)
        }).catch(() => {
            setBanner(null)
        })
    }, [activeEvent, src]);


    useEffect(() => {
        let suffix = new Date().getMilliseconds().toString();
        const logoURL = `http://localhost:8080/asset/logo/${activeEvent.eventId}?${suffix}`
        axios.get(logoURL).then(() => {
            setLogo(logoURL)
        }).catch(() => {
            setLogo(null)
        })

    }, [activeEvent, logoSrc]);


    const handleCloseDialog = () => {
        setDialog({
            isOpen: false
        });
    };

    const handleSetBanner = () => {
        getCroppedImage();
    }

    const handleBannerUploaderOpen = useCallback(() => {
        setOpenBannerUploader(true);
    }, []);

    const handleBannerUploaderClose = useCallback(() => {
        setOpenBannerUploader(false);
    }, []);

    const handleLogoUploaderOpen = useCallback(() => {
        setOpenLogoUploader(true);
    }, []);

    const handleLogoUploaderClose = useCallback(() => {
        setOpenLogoUploader(false)
    }, []);

    const isFileValidImage = file => {
        const acceptedImageTypes = ['image/gif', 'image/jpeg', 'image/png'];

        return file && acceptedImageTypes.includes(file['type'])
    };

    const isValidSize = file => {
        return file.size < 4194304;
    }


    const handleUploadLogo = async (file) => {
        if (!isFileValidImage(file)) {
            toast.error('Image must be a PNG JPG or GIF');
            return;
        }
        if (!isValidSize(file)) {
            toast.error('Image must be smaller than 4MB');
            return;
        }
        const data = await fileToBase64(file);
        setLogo(data);
        return await assetApi.setLogo(file, activeEvent.eventId)
            .then(() => {
                setLogoSrc(data)
                handleLogoUploaderClose();
            })
            .catch((error) => {
                console.log(error)
                throw error
            })
    };

    const selectImage = (file) => {
        console.log("uploading file")
        setSrc(URL.createObjectURL(file));
        setDialog({
            isOpen: true,
            data: URL.createObjectURL(file)
        });
    };

    const selectLogo = (file) => {
        console.log("uploading file")
        handleUploadLogo(file).then((r) => {
            toast.success('Logo uploaded successfully');
        }).catch((e) => {
            console.log("error:", e)
            toast.error('Logo upload failed');
        })
    }


    const toBlob = canvas => new Promise((resolve) => {
        canvas.toBlob(resolve)
    });


    const imageCanvas = (img, crop) => {
        console.log(img)
        const canvas = document.createElement('canvas');
        const scaleX = img.naturalWidth / img.width;
        const scaleY = img.naturalHeight / img.height;
        canvas.width = crop.width;
        canvas.height = crop.height;
        const ctx = canvas.getContext('2d');

        const pixelRatio = 3
        canvas.width = crop.width * pixelRatio;
        canvas.height = crop.height * pixelRatio;
        ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
        ctx.imageSmoothingQuality = 'high';

        ctx.drawImage(
            img,
            crop.x * scaleX,
            crop.y * scaleY,
            crop.width * scaleX,
            crop.height * scaleY,
            0,
            0,
            crop.width,
            crop.height,
        );
        return canvas
    };

    const getCroppedImage = async () => {
        const canvas = imageCanvas(imgRef.current, crop);

        const blob = await toBlob(canvas)
        if (!blob) {
            console.error('Failed to create blob')
            return
        }

        const previewUrl = canvas.toDataURL('image/jpeg');
        console.log(previewUrl)
        setBanner(previewUrl)
        const banner = new File([blob], "banner.jpeg", {type: "image/jpeg", lastModified: Date.now()});
        await assetApi.setBanner(banner, activeEvent.eventId).then(() => {
            toast.success('Banner uploaded successfully');
        }).catch((error) => {
            console.log(error)
            toast.error('Banner upload failed');
        })
    };


    const handleRemoveLogo = async () => {
        await assetApi.removeLogo(activeEvent.eventId)
            .then(() => {
                toast.success("Logo removed successfully")
                setLogo(null)
            })
            .catch((e) => {
                toast.error("Could not remove logo")
            })
    };

    const handleRemoveBanner = async () => {
        await assetApi.removeBanner(activeEvent.eventId)
            .then(() => {
                toast.success("Banner deleted successfully")
                setBanner(null)
            })
            .catch((e) => {
                toast.error("Could not remove banner")
            })
    };


    const handlePrimaryColorChange = (color) => {
        formik.setFieldValue('primary', `#${color.hex}`)
    };

    const handleSecondaryColorChange = (color) => {
        formik.setFieldValue('secondary', `#${color.hex}`)
    };


    return (
        <Box
            sx={{mt: 4}}
            {...props}>
            <Card>
                <CardContent>
                    <Typography variant="h6">
                        Banner
                    </Typography>
                    {banner ? (
                        <Box
                            sx={{
                                backgroundImage: `url(${banner})`,
                                backgroundPosition: 'center',
                                backgroundSize: 'cover',
                                borderRadius: 1,
                                height: 230,
                                mt: 3
                            }}
                        />
                    ) : (
                        <Box
                            sx={{
                                alignItems: 'center',
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'center',
                                border: 1,
                                borderRadius: 1,
                                borderStyle: 'dashed',
                                borderColor: 'divider',
                                height: 230,
                                mt: 3,
                                p: 3
                            }}
                        >
                            <Typography
                                align="center"
                                color="textSecondary"
                                variant="h6"
                            >
                                Select a cover image
                            </Typography>
                            <Typography
                                align="center"
                                color="textSecondary"
                                sx={{mt: 1}}
                                variant="subtitle1"
                            >
                                Image will be shown in the header of the event page
                            </Typography>
                        </Box>
                    )}
                        <Button
                            color="error"
                            onClick={handleRemoveBanner}
                            sx={{mt: 3}}
                            disabled={!banner}
                        >
                            Remove Banner
                        </Button>
                        <Button
                            sx={{mt: 3}}
                            onClick={handleBannerUploaderOpen}
                            component="label">
                            Upload Banner
                        </Button>
                    <BannerCropModal
                        banner={dialog.banner}
                        open={dialog.isOpen}
                        onClose={handleCloseDialog}
                        crop={crop}
                        setCrop={setCrop}
                        imgRef={imgRef}
                        src={src}
                        setSrc={setSrc}
                        setBanner={handleSetBanner}
                    />
                </CardContent>
            </Card>
            <Card sx={{mt: 4}}>
                <CardContent>
                    <Grid
                        container
                        spacing={3}
                    >
                        <Grid
                            item
                            md={4}
                            xs={12}
                        >
                            <Typography variant="h6">
                                Logo
                            </Typography>
                        </Grid>
                        <Grid
                            item
                            md={8}
                            xs={12}
                        >
                            {logo ? (
                                <img src={`${logo}`} alt="LOGO" width="200"/>

                            ) : (
                                <Box/>
                            )}
                            <Box
                                sx={{
                                    justifyContent: 'right',
                                    alignItems: 'right',
                                    }}
                            >
                                <Button
                                    color="error"
                                    onClick={handleRemoveLogo}
                                    sx={{mt: 3}}
                                    disabled={!logo}
                                >
                                    Remove Logo
                                </Button>
                                <Button
                                    sx={{mt: 3}}
                                    onClick={handleLogoUploaderOpen}
                                    component="label">
                                    Upload Logo
                                </Button>
                            </Box>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>
            <Card sx={{mt: 4}}>
                <CardContent>
                    <Grid
                        item
                        md={4}
                        xs={12}
                        sx={{
                            paddingBottom: 5,
                        }}
                    >
                        <Typography variant="h6">
                            Styles
                        </Typography>
                    </Grid>
                    <Grid
                        container
                        spacing={3}
                    >
                        <Grid
                            item
                            md={4}
                            xs={12}
                        >
                            <Typography variant="h7">
                                Primary
                            </Typography>
                        </Grid>
                        <Grid
                            item
                            md={1}
                            xs={12}
                        >
                            <ColorPicker
                                hideTextfield={true}
                                onChange={handlePrimaryColorChange}
                                value={formik.values.primary}
                            />
                        </Grid>
                        <Grid
                            item
                            md={6}
                            xs={12}
                        >
                            <TextField
                                error={Boolean(formik.touched.primary && formik.errors.primary)}
                                fullWidth
                                helperText={formik.touched.primary && formik.errors.primary}
                                label="Primary"
                                name="primary"
                                onBlur={formik.handleBlur}
                                onChange={formik.handleChange}
                                value={formik.values.primary}
                                size="small"
                                fullWidht
                            />
                        </Grid>
                        <Grid
                            item
                            md={4}
                            xs={12}
                        >
                            <Typography variant="h7">
                                Secondary
                            </Typography>
                        </Grid>
                        <Grid
                            item
                            md={1}
                            xs={12}
                        >
                            <ColorPicker
                                hideTextfield={true}
                                onChange={handleSecondaryColorChange}
                                value={formik.values.secondary}
                            />
                        </Grid>
                        <Grid
                            item
                            md={6}
                            xs={12}
                        >
                            <TextField
                                error={Boolean(formik.touched.secondary && formik.errors.secondary)}
                                fullWidth
                                helperText={formik.touched.secondary && formik.errors.secondary}
                                label="Secondary"
                                name="secondary"
                                onBlur={formik.handleBlur}
                                onChange={formik.handleChange}
                                value={formik.values.secondary}
                                size="small"
                                fullWidht
                            />
                        </Grid>
                        <Grid item/>
                    </Grid>
                </CardContent>
            </Card>
            <FileUploader
                maxFiles={1}
                onUpload={selectLogo}
                onClose={handleLogoUploaderClose}
                open={openLogoUploader}
                />
            <FileUploader
                maxFiles={1}
                onUpload={selectImage}
                onClose={handleBannerUploaderClose}
                open={openBannerUploader}
            />
        </Box>

    );
};
EventStylingSettings.propTypes = {
    formik: PropTypes.object
};

EventStylingSettings.getInitialProps = async ({ store, res }) => {
    if (res) {
        // res available only at server
        // no-store disable bfCache for any browser. So your HTML will not be cached
        res.setHeader('Cache-Control', 'no-store');
    }

    await store.dispatch(action());
    return {};
};

