import { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Dialog, DialogContent, IconButton, Stack, SvgIcon, Typography } from '@mui/material';
import { FileDropzone } from '../../../components/file-dropzone';
import XIcon from '@untitled-ui/icons-react/build/esm/X';

export const FileUploader = (props) => {
  const { onClose, onUpload, maxFiles, open = false } = props;
  const [files, setFiles] = useState([]);

  useEffect(() => {
    setFiles([]);
  }, [open]);

  const handleDrop = useCallback((newFiles) => {
    setFiles((prevFiles) => {
      return [...prevFiles, ...newFiles];
    });
  }, []);

  const handleRemove = useCallback((file) => {
    setFiles((prevFiles) => {
      return prevFiles.filter((_file) => _file.path !== file.path);
    });
  }, []);

  const handleRemoveAll = useCallback(() => {
    setFiles([]);
  }, []);

  return (
    <Dialog
      fullWidth
      maxWidth="sm"
      open={open}
      onClose={onClose}
    >
      <Stack
        alignItems="center"
        direction="row"
        justifyContent="space-between"
        spacing={3}
        sx={{
          px: 3,
          py: 2
        }}
      >
        <Typography variant="h6">
          Upload Files
        </Typography>
        <IconButton
          color="inherit"
          onClick={onClose}
        >
          <SvgIcon>
            <XIcon />
          </SvgIcon>
        </IconButton>
      </Stack>
      <DialogContent>
        <FileDropzone
          accept={["image/jpg", "image/png", "image/jpeg"]}
          caption={"Max file size is 3 MB" + "\n" + "accepted formats are jpg, png, jpeg"}
          files={files}
          disabled={files.length >= maxFiles}
          onDrop={handleDrop}
          onRemove={handleRemove}
          onRemoveAll={handleRemoveAll}
          onUpload={() => {onUpload(files[0]); onClose(); handleRemoveAll();}}
        />
      </DialogContent>
    </Dialog>
  );
};

FileUploader.propTypes = {
  maxFiles: PropTypes.number,
  onUpload : PropTypes.func,
  onClose: PropTypes.func,
  open: PropTypes.bool
};
