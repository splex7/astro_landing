import * as React from 'react';
import Tab from '@mui/material/Tab';
import {TabContext} from '@mui/lab';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import SpecTable from './SpecTable';
import SpecSimplified from './SpecSimplified';
import type { PaletteMode } from '@mui/material';
import { createTheme, Box } from '@mui/material';
import { ThemeProvider, useTheme} from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import IconButton from '@mui/material/IconButton';
import Fab from '@mui/material/Fab';

// Theme definition
const getDesignTokens = (mode: PaletteMode) => ({
  palette: {
    mode,
    ...(mode === 'light'
      ? {
          // palette values for light mode
          primary: {
            light: '#000',
            main: '#000',
            dark: '#000',
            contrastText: '#fff',
            },
            secondary: {
              light: '#424242',
              main: '#424242',
              dark: '#424242',
              contrastText: '#fff',
            },
            background: {
              default: '#fff',
              paper: '#f5f7f9'
            }
        }
      : {
          // palette values for dark mode
          primary: {
            light: '#fff',
            main: '#fff',
            dark: '#fff',
            contrastText: '#000',
            },
            secondary: {
              light: '#ededed',
              main: '#ededed',
              dark: '#ededed',
              contrastText: '#000',
            },
            background: {
              default: '#141414',
              paper: '#212121'
            }
        }),
  },
});



export default function SpecChecker() {

  // Handle dark/light mode changes
  const [mode, setMode] = React.useState<'light' | 'dark'>('light');
  const colorMode = React.useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
      },
    }),
    [],
  );
  const theme = React.useMemo(
    () =>
    createTheme(getDesignTokens(mode)),
    [mode],
  );

  // Handle tab changes
  const [value, setValue] = React.useState('1');
  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  // tabs from https://mui.com/material-ui/react-tabs/
  // theme and dark mode based on https://mui.com/material-ui/customization/dark-mode/ and
  // https://mui.com/material-ui/customization/palette/
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />

		<div className="mx-auto font-extrabold text-3xl md:text-5xl pt-5" ><center>ISO Bunker Fuel Specification Checker</center></div> 
    <div className='mx-auto'  style={{maxWidth: 1120, paddingTop: 30}}>
      <TabContext value={value}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <TabList onChange={handleChange} aria-label="lab API tabs example">
            <Tab label="Simplified" value="1" />
            <Tab label="Full Table" value="2" />
          </TabList>
        </Box>
        <TabPanel value="1" sx={{padding: 0,}}>
            <SpecSimplified />
        </TabPanel>
        <TabPanel value="2" sx={{padding: 0,}}>
            <SpecTable />
        </TabPanel>
      </TabContext>
      <Fab color="primary" size="small"  aria-label="add" sx={{position:'absolute', right: '2%', top: '2%'}} onClick={colorMode.toggleColorMode} >
        {theme.palette.mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
      </Fab>
    </div>
    </ThemeProvider>
  );
}