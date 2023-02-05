import {useEffect, useMemo, useState} from 'react';
import { usePathname } from 'next/navigation';
import NextLink from 'next/link';
import PropTypes from 'prop-types';
import File04Icon from '@untitled-ui/icons-react/build/esm/File04';
import {Avatar, Box, Button, Drawer, Stack, SvgIcon, Typography} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { Logo } from '../../../components/logo';
import { Scrollbar } from '../../../components/scrollbar';
import { paths } from '../../../paths';
import { TenantSwitch } from '../tenant-switch';
import { SideNavSection } from '../vertical-layout/side-nav-section';
import {EventPopoverMobile} from "../event-button/event-popover-mobile";
import {useSelector} from "react-redux";
import axios from "axios";

const MOBILE_NAV_WIDTH = 280;

const useCssVars = (color) => {
  const theme = useTheme();

  return useMemo(() => {
    switch (color) {
      // Blend-in and discreet have no difference on mobile because
      // there's a backdrop and differences are not visible
      case 'blend-in':
      case 'discreet':
        if (theme.palette.mode === 'dark') {
          return {
            '--nav-bg': theme.palette.background.default,
            '--nav-color': theme.palette.neutral[100],
            '--nav-logo-border': theme.palette.neutral[700],
            '--nav-section-title-color': theme.palette.neutral[400],
            '--nav-item-color': theme.palette.neutral[400],
            '--nav-item-hover-bg': 'rgba(255, 255, 255, 0.04)',
            '--nav-item-active-bg': 'rgba(255, 255, 255, 0.04)',
            '--nav-item-active-color': theme.palette.text.primary,
            '--nav-item-disabled-color': theme.palette.neutral[600],
            '--nav-item-icon-color': theme.palette.neutral[500],
            '--nav-item-icon-active-color': theme.palette.primary.main,
            '--nav-item-icon-disabled-color': theme.palette.neutral[700],
            '--nav-item-chevron-color': theme.palette.neutral[700],
            '--nav-scrollbar-color': theme.palette.neutral[400]
          };
        } else {
          return {
            '--nav-bg': theme.palette.background.default,
            '--nav-color': theme.palette.text.primary,
            '--nav-logo-border': theme.palette.neutral[100],
            '--nav-section-title-color': theme.palette.neutral[400],
            '--nav-item-color': theme.palette.text.secondary,
            '--nav-item-hover-bg': theme.palette.action.hover,
            '--nav-item-active-bg': theme.palette.action.selected,
            '--nav-item-active-color': theme.palette.text.primary,
            '--nav-item-disabled-color': theme.palette.neutral[400],
            '--nav-item-icon-color': theme.palette.neutral[400],
            '--nav-item-icon-active-color': theme.palette.primary.main,
            '--nav-item-icon-disabled-color': theme.palette.neutral[400],
            '--nav-item-chevron-color': theme.palette.neutral[400],
            '--nav-scrollbar-color': theme.palette.neutral[900]
          };
        }

      case 'evident':
        if (theme.palette.mode === 'dark') {
          return {
            '--nav-bg': theme.palette.neutral[800],
            '--nav-color': theme.palette.common.white,
            '--nav-logo-border': theme.palette.neutral[700],
            '--nav-section-title-color': theme.palette.neutral[400],
            '--nav-item-color': theme.palette.neutral[400],
            '--nav-item-hover-bg': 'rgba(255, 255, 255, 0.04)',
            '--nav-item-active-bg': 'rgba(255, 255, 255, 0.04)',
            '--nav-item-active-color': theme.palette.common.white,
            '--nav-item-disabled-color': theme.palette.neutral[500],
            '--nav-item-icon-color': theme.palette.neutral[400],
            '--nav-item-icon-active-color': theme.palette.primary.main,
            '--nav-item-icon-disabled-color': theme.palette.neutral[500],
            '--nav-item-chevron-color': theme.palette.neutral[600],
            '--nav-scrollbar-color': theme.palette.neutral[400]
          };
        } else {
          return {
            '--nav-bg': theme.palette.neutral[800],
            '--nav-color': theme.palette.common.white,
            '--nav-logo-border': theme.palette.neutral[700],
            '--nav-section-title-color': theme.palette.neutral[400],
            '--nav-item-color': theme.palette.neutral[400],
            '--nav-item-hover-bg': 'rgba(255, 255, 255, 0.04)',
            '--nav-item-active-bg': 'rgba(255, 255, 255, 0.04)',
            '--nav-item-active-color': theme.palette.common.white,
            '--nav-item-disabled-color': theme.palette.neutral[500],
            '--nav-item-icon-color': theme.palette.neutral[400],
            '--nav-item-icon-active-color': theme.palette.primary.main,
            '--nav-item-icon-disabled-color': theme.palette.neutral[500],
            '--nav-item-chevron-color': theme.palette.neutral[600],
            '--nav-scrollbar-color': theme.palette.neutral[400]
          };
        }

      default:
        return {};
    }
  }, [theme, color]);
};

export const MobileNav = (props) => {
  const { color = 'evident', open, onClose, sections = [] } = props;
  const pathname = usePathname();
  const cssVars = useCssVars(color);
  const [logo, setLogo] = useState(null);
  const activeEvent = useSelector(state => state.event.activeEvent);

  useEffect(() => {
    let suffix = new Date().getMilliseconds().toString();
    const logoURL = `http://localhost:8080/asset/logo/${activeEvent.eventId}?${suffix}`
    axios.get(logoURL).then(() => {
      setLogo(logoURL)
    }).catch(() => {
      setLogo(null)
    })

  }, [activeEvent]);

  return (
    <Drawer
      anchor="left"
      onClose={onClose}
      open={open}
      PaperProps={{
        sx: {
          ...cssVars,
          backgroundColor: 'var(--nav-bg)',
          color: 'var(--nav-color)',
          width: MOBILE_NAV_WIDTH
        }
      }}
      variant="temporary"
    >
      <Scrollbar
        sx={{
          height: '100%',
          '& .simplebar-content': {
            height: '100%'
          },
          '& .simplebar-scrollbar:before': {
            background: 'var(--nav-scrollbar-color)'
          }
        }}
      >
        <Stack sx={{ height: '100%' }}>
          <Stack
            alignItems="center"
            direction="row"
            spacing={2}
            sx={{ p: 3 }}
          >
            { logo &&  (
              <Avatar
                  src={logo}
                  size={40}
                  sx={{
                    borderColor: 'var(--nav-logo-border)',
                    borderRadius: 1,
                    borderStyle: 'solid',
                    borderWidth: 1,
                    objectFit: 'cover'
              }} variant="rounded"/>
            )}
            <EventPopoverMobile sx={{ flexGrow: 1 }} />
          </Stack>
          <Stack
            component="nav"
            spacing={2}
            sx={{
              flexGrow: 1,
              px: 2
            }}
          >
            {sections.map((section, index) => (
              <SideNavSection
                items={section.items}
                key={index}
                pathname={pathname}
                subheader={section.subheader}
              />
            ))}
          </Stack>
          <Box sx={{ p: 3 }}>
            <Typography
              color="neutral.400"
              variant="subtitle1"
            >
              Need help?
            </Typography>
            <Typography
              color="neutral.400"
              sx={{ mb: 2 }}
              variant="body2"
            >
              Please check our docs.
            </Typography>
            <Button
              component={NextLink}
              fullWidth
              href={paths.docs.welcome}
              startIcon={(
                <SvgIcon>
                  <File04Icon />
                </SvgIcon>
              )}
              variant="contained"
            >
              Documentation
            </Button>
          </Box>
        </Stack>
      </Scrollbar>
    </Drawer>
  );
};

MobileNav.propTypes = {
  color: PropTypes.oneOf(['blend-in', 'discreet', 'evident']),
  onClose: PropTypes.func,
  open: PropTypes.bool,
  sections: PropTypes.array
};
