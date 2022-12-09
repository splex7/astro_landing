import * as React from 'react';
import {Box, Tab, Tabs, createTheme, PaletteMode, Fab, CssBaseline} from '@mui/material';
import SpecTable from './SpecTable';
import SpecSimplified from './SpecSimplified';
import { ThemeProvider } from '@mui/material/styles';
import {Brightness4, Brightness7} from '@mui/icons-material';
import {TabPanel, a11yProps} from './TabTools';

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
  const [value, setValue] = React.useState(0);
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
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
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs  value={value} onChange={handleChange} aria-label="lab API tabs example">
            <Tab label="Simplified" {...a11yProps(0)} />
            <Tab label="Full Table" {...a11yProps(1)} />
          </Tabs>
        </Box>
        <TabPanel value={value} index={0}>
            <SpecSimplified />
        </TabPanel>
        <TabPanel value={value} index={1}>
            <SpecTable />
        </TabPanel>
      <Fab color="primary" size="small"  aria-label="add" sx={{position:'absolute', right: '2%', top: '2%'}} onClick={colorMode.toggleColorMode} >
        {theme.palette.mode === 'dark' ? <Brightness7 /> : <Brightness4 />}
      </Fab>
    </div>
    </ThemeProvider>
  );
}