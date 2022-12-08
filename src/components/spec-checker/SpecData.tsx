import Box from '@mui/material/Box';
import Grid from '@mui/material/Unstable_Grid2';
import type { GridColDef } from '@mui/x-data-grid';

export const DistData2017: Array<DistillateData2017> = [
    {id: 1, Parameter: 'Kinematic viscosity at 40°C', Unit: 'mm²/s', Limit: 'Max.', DMX: '5.500', DMA: '6.000', DFA: '6.000', DMZ: '6.000', DFZ: '6.000', DMB: '11.00', DFB: '11.00' },
    {id: 2, Parameter: 'Kinematic viscosity at 40°C', Unit: 'mm²/s', Limit: 'Min.', DMX:  '1.400', DMA: '2.000', DFA: '2.000', DMZ: '3.000', DFZ: '3.000', DMB: '2.000', DFB: '2.000' },
    {id: 3, Parameter: 'Density at 15°C', Unit: 'kg/m³', Limit: 'Max.', DMX: '-', DMA: '890.0', DFA: '890.0', DMZ: '890.0', DFZ: '890.0', DMB: '900.0', DFB: '900.0' },
    {id: 4, Parameter: 'Cetane index', Unit: '-', Limit: 'Min.', DMX: '45', DMA: '40', DFA: '40', DMZ: '40', DFZ: '40', DMB: '35', DFB: '35' },
    {id: 5, Parameter: 'Sulfur', Unit: 'mass %', Limit: 'Max.', DMX: '1.00', DMA: '1.00', DFA: '1.00', DMZ: '1.00', DFZ: '1.00', DMB: '1.50', DFB: '1.50'},
    {id: 6, Parameter: 'Flash point', Unit: '°C', Limit: 'Min.', DMX: '43.0', DMA: '60.0', DFA: '60.0', DMZ: '60.0', DFZ: '60.0', DMB: '60.0', DFB: '60.0' },
    {id: 7, Parameter: 'Hydrogen sulfide', Unit: 'mg/kg', Limit: 'Max.', DMX: '2.00', DMA: '2.00', DFA: '2.00', DMZ: '2.00', DFZ: '2.00', DMB: '2.00', DFB: '2.00' },
    {id: 8, Parameter: 'Acid number', Unit: 'mg KOH/g', Limit: 'Max.', DMX: '0.5', DMA: '0.5', DFA: '0.5', DMZ: '0.5', DFZ: '0.5', DMB: '0.5', DFB: '0.5' },
    {id: 9, Parameter: 'Total sediment by hot filtration', Unit: 'mass %', Limit: 'Max.', DMX: '-', DMA: '-', DFA: '-', DMZ: '-', DFZ:'-', DMB: '0.10', DFB: '0.10' },
    {id: 10, Parameter: 'Oxidation stability', Unit: 'g/m³', Limit: 'Max.', DMX: '25', DMA: '25', DFA: '25', DMZ: '25', DFZ: '25', DMB: '25', DFB: '25' },
    {id: 11, Parameter: 'Fatty acid methyl ester (FAME)', Unit: 'volume %', Limit: 'Max.', DMX: '-', DMA: '-', DFA: '7.0', DMZ: '-', DFZ: '7.0', DMB: '-', DFB: '7.0' },
    {id: 12, Parameter: 'Carbon residue - micro method on the 10% volume distillation residue', Unit: 'mass %', Limit: 'Max.', DMX: '0.30', DMA: '0.30', DFA: '0.30', DMZ: '0.30', DFZ: '0.30', DMB: '-', DFB: '-' },
    {id: 13, Parameter: 'Carbon residue - micro method', Unit: 'mass %', Limit: 'Max.', DMX: '-', DMA: '-', DFA: '-', DMZ: '-', DFZ: '-', DMB: '0.30', DFB: '0.30' },
    {id: 14, Parameter: 'Cloud point winter', Unit: '°C', Limit: 'Max.', DMX: '-16', DMA: 'report', DFA: 'report', DMZ: 'report', DFZ: 'report', DMB: '-', DFB: '-' },
    {id: 15, Parameter: 'Cloud point summer', Unit: '°C', Limit: 'Max.', DMX: '-16', DMA: '-', DFA: '-', DMZ: '-', DFZ: '-', DMB: '-', DFB: '-' },
    {id: 16, Parameter: 'Cold filter plugging point winter', Unit: '°C', Limit: 'Max.', DMX: '-', DMA: 'report', DFA: 'report', DMZ: 'report', DFZ: 'report', DMB: '-', DFB: '-' },
    {id: 17, Parameter: 'Cold filter plugging point summer', Unit: '°C', Limit: 'Max.', DMX: '-', DMA: '-', DFA: '-', DMZ: '-', DFZ: '-', DMB: '-', DFB: '-' },
    {id: 18, Parameter: 'Pour point (upper) winter', Unit: '°C', Limit: 'Max.', DMX: '-', DMA: '-6', DFA: '-6', DMZ: '-6', DFZ: '-6', DMB: '0', DFB: '0' },
    {id: 19, Parameter: 'Pour point (upper) summer', Unit: '°C', Limit: 'Max.', DMX: '-', DMA: '0', DFA: '0', DMZ: '0', DFZ: '0', DMB: '6', DFB: '6' },
    {id: 20, Parameter: 'Appearance', Unit: '-', Limit: '-', DMX: 'Clear & Bright', DMA: 'Clear & Bright', DFA: 'Clear & Bright', DMZ: 'Clear & Bright', DFZ: 'Clear & Bright', DMB: '-', DFB: '-' },
    {id: 21, Parameter: 'Water', Unit: 'volume %', Limit: 'Max.', DMX: '-', DMA: '-', DFA: '-', DMZ: '-', DFZ: '-', DMB: '-', DFB: '0.30' },
    {id: 22, Parameter: 'Ash', Unit: 'mass %', Limit: 'Max.', DMX: '0.010', DMA: '0.010', DFA: '0.010', DMZ: '0.010', DFZ: '0.010', DMB: '0.010', DFB: '0.010' },
    {id: 23, Parameter: 'Lubricity, corrected wear scar diameter (WSD) at 60°C', Unit: 'µm', Limit: 'Max.', DMX: '520', DMA: '520', DFA: '520', DMZ: '520', DFZ: '520', DMB: '520', DFB: '520' }
  ];

export const DistData20122010: Array<DistillateData201220102005> = [
    {id: 1, Parameter: 'Kinematic viscosity at 40°C', Unit: 'mm²/s', Limit: 'Max.', DMX: '5.500', DMA: '6.000', DMZ: '6.000', DMB: '11.00'},
    {id: 2, Parameter: 'Kinematic viscosity at 40°C', Unit: 'mm²/s', Limit: 'Min.', DMX:  '1.400', DMA: '2.000', DMZ: '3.000', DMB: '2.000'},
    {id: 3, Parameter: 'Carbon residue - micro method on the 10% volume distillation residue', Unit: 'mass %', Limit: 'Max.', DMX: '0.30', DMA: '0.30', DMZ: '0.30', DMB: '-'},
    {id: 4, Parameter: 'Density at 15°C', Unit: 'kg/m³', Limit: 'Max.', DMX: '-', DMA: '890.0', DMZ: '890.0', DMB: '900.0'},
    {id: 5, Parameter: 'Carbon residue - micro method', Unit: 'mass %', Limit: 'Max.', DMX: '-', DMA: '-', DMZ: '-', DMB: '0.30'},
    {id: 6, Parameter: 'Sulfur', Unit: 'mass %', Limit: 'Max.', DMX: '1.00', DMA: '1.50', DMZ: '1.50', DMB: '2.00'}, 
    {id: 7, Parameter: 'Water', Unit: 'volume %', Limit: 'Max.', DMX: '-', DMA: '-', DMZ: '-', DMB: '0.30'},
    {id: 8, Parameter: 'Total sediment by hot filtration', Unit: 'mass %', Limit: 'Max.', DMX: '-', DMA: '-', DMZ: '-', DMB: '0.10'},
    {id: 9, Parameter: 'Ash', Unit: 'mass %', Limit: 'Max.', DMX: '0.010', DMA: '0.010', DMZ: '0.010', DMB: '0.010'},
    {id: 10, Parameter: 'Flash point', Unit: '°C', Limit: 'Min.', DMX: '43.0', DMA: '60.0', DMZ: '60.0', DMB: '60.0'},
    {id: 11, Parameter: 'Pour point (upper) summer', Unit: '°C', Limit: 'Max.', DMX: '-', DMA: '0', DMZ: '0', DMB: '6'},
    {id: 12, Parameter: 'Pour point (upper) winter', Unit: '°C', Limit: 'Max.', DMX: '-', DMA: '-6', DMZ: '-6', DMB: '0'},
    {id: 13, Parameter: 'Cloud point', Unit: '°C', Limit: 'Max.', DMX: '-16', DMA: 'report', DMZ: 'report', DMB: '-'},
    {id: 14, Parameter: 'Cetane index', Unit: '-', Limit: 'Min.', DMX: '45', DMA: '40', DMZ: '40', DMB: '35'},
    {id: 15, Parameter: 'Acid number', Unit: 'mg KOH/g', Limit: 'Max.', DMX: '0.5', DMA: '0.5', DMZ: '0.5', DMB: '0.5'},
    {id: 16, Parameter: 'Oxidation stability', Unit: 'g/m³', Limit: 'Max.', DMX: '25', DMA: '25', DMZ: '25', DMB: '25'},
    {id: 17, Parameter: 'Lubricity, corrected wear scar diameter (WSD) at 60°C', Unit: 'µm', Limit: 'Max.', DMX: '520', DMA: '520', DMZ: '520', DMB: '520'},
    {id: 18, Parameter: 'Hydrogen sulfide', Unit: 'mg/kg', Limit: 'Max.', DMX: '2.00', DMA: '2.00', DMZ: '2.00', DMB: '2.00'},
    {id: 19, Parameter: 'Appearance', Unit: '-', Limit: '-', DMX: 'Clear & Bright', DMA: 'Clear & Bright', DMZ: 'Clear & Bright', DMB: '-'},
    ];
  
  
export const DistData2005: Array<DistillateData201220102005>  = [
    {id: 1, Parameter: 'Kinematic viscosity at 40°C', Unit: 'mm²/s', Limit: 'Max.', DMX: '5.500', DMA: '6.000', DMZ: '11.000', DMB: '14.00'},
    {id: 2, Parameter: 'Kinematic viscosity at 40°C', Unit: 'mm²/s', Limit: 'Min.', DMX:  '1.400', DMA: '1.500', DMZ: '-', DMB: '-'},
    {id: 3, Parameter: 'Carbon residue - micro method on the 10% volume distillation residue', Unit: 'mass %', Limit: 'Max.', DMX: '0.30', DMA: '0.30', DMZ: '-', DMB: '-'},
    {id: 4, Parameter: 'Density at 15°C', Unit: 'kg/m³', Limit: 'Max.', DMX: '-', DMA: '890.0', DMZ: '900.0', DMB: '920.0'},
    {id: 5, Parameter: 'Carbon residue - micro method', Unit: 'mass %', Limit: 'Max.', DMX: '-', DMA: '-', DMZ: '0.30', DMB: '2.50'},
    {id: 6, Parameter: 'Sulfur', Unit: 'mass %', Limit: 'Max.', DMX: '1.00', DMA: '1.50', DMZ: '2.00', DMB: '2.00'}, 
    {id: 7, Parameter: 'Water', Unit: 'volume %', Limit: 'Max.', DMX: '-', DMA: '-', DMZ: '0.30', DMB: '0.30'},
    {id: 8, Parameter: 'Total sediment by hot filtration', Unit: 'mass %', Limit: 'Max.', DMX: '-', DMA: '-', DMZ: '-', DMB: '0.10'},
    {id: 9, Parameter: 'Ash', Unit: 'mass %', Limit: 'Max.', DMX: '0.010', DMA: '0.010', DMZ: '0.010', DMB: '0.05'},
    {id: 10, Parameter: 'Flash point', Unit: '°C', Limit: 'Min.', DMX: '43.0', DMA: '60.0', DMZ: '60.0', DMB: '60.0'},
    {id: 11, Parameter: 'Pour point (upper) summer', Unit: '°C', Limit: 'Max.', DMX: '-', DMA: '0', DMZ: '6', DMB: '6'},
    {id: 12, Parameter: 'Pour point (upper) winter', Unit: '°C', Limit: 'Max.', DMX: '-', DMA: '-6', DMZ: '0', DMB: '0'},
    {id: 13, Parameter: 'Cloud point', Unit: '°C', Limit: 'Max.', DMX: '-16', DMA: '-', DMZ: '-', DMB: '-'},
    {id: 14, Parameter: 'Cetane index', Unit: '-', Limit: 'Min.', DMX: '45', DMA: '40', DMZ: '35', DMB: '-'},
    {id: 15, Parameter: 'Vanadium', Unit: 'mg/kg', Limit: 'Max.', DMX: '-', DMA: '-', DMZ: '-', DMB: '100'},
    {id: 16, Parameter: 'Aliminium + Silicon', Unit: 'mg/kg', Limit: 'Max.', DMX: '-', DMA: '-', DMZ: '-', DMB: '25'},
    {id: 17, Parameter: 'Zinc', Unit: 'mg/kg', Limit: 'Max.', DMX: '-', DMA: '-', DMZ: '-', DMB: '15'},
    {id: 18, Parameter: 'Phosphorus', Unit: 'mg/kg', Limit: 'Max.', DMX: '-', DMA: '-', DMZ: '-', DMB: '15'},
    {id: 19, Parameter: 'Calcium', Unit: 'mg/kg', Limit: 'Max.', DMX: '-', DMA: '-', DMZ: '-', DMB: '30'},
    {id: 20, Parameter: 'Appearance', Unit: '-', Limit: '-', DMX: 'Clear & Bright', DMA: 'Clear & Bright', DMZ: '-', DMB: '-'},
    ];

export const ResData2005: Array<ResidualData2005> = [
  {id: 1, Parameter: 'Viscosity at 50°C', Unit: 'mm²/s', Limit: 'Max.', RMA30: '30.00', RMB30: '30.00', RMD80: '80.0',  RME180: '180.0' , RMF180: '180.0', RMG380: '380.0', RMH380: '380.0', RMK380: '380.0', RMH700: '700.0', RMK700: '700.0'},
  {id: 2, Parameter: 'Density at 15°C ', Unit: 'kg/m³', Limit: 'Max.', RMA30: '960.0', RMB30: '975.0', RMD80: '980.0', RME180: '991.0' ,RMF180: '991.0', RMG380: '991.0', RMH380: '991.0', RMK380: '1010.0', RMH700: '991.0', RMK700: '1010.0'},
  {id: 3, Parameter: 'Micro Carbon Residue', Unit: '% m/m', Limit: 'Max.', RMA30: '10.00', RMB30: '10.00', RMD80: '14.00', RME180: '15.00' ,RMF180: '20.00', RMG380: '18.00', RMH380: '22.00', RMK380: '22.00', RMH700: '22.00', RMK700: '22.00'},
  {id: 4, Parameter: 'Aluminium + Silicon', Unit: 'mg/kg', Limit: 'Max.', RMA30: '80', RMB30: '80', RMD80: '80', RME180: '80' ,RMF180: '80', RMG380: '80', RMH380: '80', RMK380: '80', RMH700: '80', RMK700: '80'},
  {id: 5, Parameter: 'Ash', Unit: '% m/m', Limit: 'Max.', RMA30: '0.10', RMB30: '0.10', RMD80: '0.10', RME180: '0.10' ,RMF180: '0.15', RMG380: '0.15', RMH380: '0.15', RMK380: '0.15', RMH700: '0.15', RMK700: '0.15'},
  {id: 6, Parameter: 'Vanadium', Unit: 'mg/kg', Limit: 'Max.', RMA30: '150', RMB30: '150', RMD80: '350', RME180: '200' ,RMF180: '500', RMG380: '300', RMH380: '600', RMK380: '600', RMH700: '600', RMK700: '600'},
  {id: 7, Parameter: 'Water', Unit: '% V/V', Limit: 'Max.', RMA30: '0.50', RMB30: '0.50', RMD80: '0.50', RME180: '0.50' ,RMF180: '0.50', RMG380: '0.50', RMH380: '0.50', RMK380: '0.50', RMH700: '0.50', RMK700: '0.50'},
  {id: 8, Parameter: 'Pour point (upper) in Summer', Unit: '°C', Limit: 'Max.', RMA30: '6', RMB30: '24', RMD80: '30', RME180: '30', RMF180: '30', RMG380: '30', RMH380: '30', RMK380: '30', RMH700: '30', RMK700: '30'},
  {id: 9, Parameter: 'Pour point (upper) in Winter', Unit: '°C', Limit: 'Max.', RMA30: '0', RMB30: '24', RMD80: '30', RME180: '30' ,RMF180: '30', RMG380: '30', RMH380: '30', RMK380: '30', RMH700: '30', RMK700: '30'},
  {id: 10, Parameter: 'Flash point', Unit: '°C', Limit: 'Max.', RMA30: '60.0', RMB30: '60.0', RMD80: '60.0', RME180: '60.0' ,RMF180: '60.0', RMG380: '60.0', RMH380: '60.0', RMK380: '60.0', RMH700: '60.0', RMK700: '60.0'},
  {id: 11, Parameter: 'Sulphur', Unit: '% m/m', Limit: 'Min.', RMA30: '3.5', RMB30: '3.5', RMD80: '4.0', RME180: '4.5' ,RMF180: '4.5', RMG380: '4.5', RMH380: '4.5', RMK380: '4.5', RMH700: '4.5', RMK700: '4.5'},
  {id: 12, Parameter: 'Total Sediment, Potential', Unit: '(% m/m', Limit: 'Max.', RMA30: '0.10', RMB30: '0.10', RMD80: '0.10', RME180: '0.10' ,RMF180: '0.10', RMG380: '0.10', RMH380: '0.10', RMK380: '0.10', RMH700: '0.10', RMK700: '0.10'},
  {id: 13, Parameter: 'Zinc', Unit: 'mg/kg', Limit: 'Max.', RMA30: '15', RMB30: '15', RMD80: '15', RME180: '15' ,RMF180: '15', RMG380: '15', RMH380: '15', RMK380: '15', RMH700: '15', RMK700: '15'},
  {id: 14, Parameter: 'Phosphorus', Unit: 'mg/kg', Limit: 'Max.', RMA30: '15', RMB30: '15', RMD80: '15', RME180: '15' ,RMF180: '15', RMG380: '15', RMH380: '15', RMK380: '15', RMH700: '15', RMK700: '15'},
  {id: 15, Parameter: 'Calcium', Unit: 'mg/kg', Limit: 'Max.', RMA30: '30', RMB30: '30', RMD80: '30', RME180: '30' ,RMF180: '30', RMG380: '30', RMH380: '30', RMK380: '30', RMH700: '30', RMK700: '30'},
]

export const ResData201720122010: Array<ResidualData201720122010> = [
  {id: 1, Parameter: 'Viscosity at 50°C', Unit: 'mm²/s', Limit: 'Max.', RMA10: '10.00', RMB30: '30.00', RMD80: '80.00', RME180: '180.0' ,RMG180: '180.0', RMG380: '380.0', RMG500: '500.0', RMG700: '700.0', RMK380: '380.0', RMK500: '500.0', RMK700: '700.0'},
  {id: 2, Parameter: 'Density at 15°C ', Unit: 'kg/m³', Limit: 'Max.', RMA10: '920.0', RMB30: '960.0', RMD80: '975.0', RME180: '991.0' ,RMG180: '991.0', RMG380: '991.0', RMG500: '991.0', RMG700: '991.0', RMK380: '1010.0', RMK500: '1010.0', RMK700: '1010.0'},
  {id: 3, Parameter: 'Micro Carbon Residue', Unit: '% m/m', Limit: 'Max.', RMA10: '2.50', RMB30: '10.00', RMD80: '14.00', RME180: '15.00' ,RMG180: '18.00', RMG380: '18.00', RMG500: '18.00', RMG700: '18.00', RMK380: '20.00', RMK500: '20.00', RMK700: '20.00'},
  {id: 4, Parameter: 'Aluminium + Silicon', Unit: 'mg/kg', Limit: 'Max.', RMA10: '25', RMB30: '40', RMD80: '40', RME180: '50' ,RMG180: '60', RMG380: '60', RMG500: '60', RMG700: '60', RMK380: '60', RMK500: '60', RMK700: '60'},
  {id: 5, Parameter: 'Sodium', Unit: 'mg/kg', Limit: 'Max.', RMA10: '50', RMB30: '100', RMD80: '100', RME180: '50' ,RMG180: '100', RMG380: '100', RMG500: '100', RMG700: '100', RMK380: '100', RMK500: '100', RMK700: '100'},
  {id: 6, Parameter: 'Ash', Unit: '% m/m', Limit: 'Max.', RMA10: '0.040', RMB30: '0.070', RMD80: '0.070', RME180: '0.070' ,RMG180: '0.100', RMG380: '0.100', RMG500: '0.100', RMG700: '0.100', RMK380: '0.150', RMK500: '0.150', RMK700: '0.150'},
  {id: 7, Parameter: 'Vanadium', Unit: 'mg/kg', Limit: 'Max.', RMA10: '50', RMB30: '150', RMD80: '150', RME180: '150' ,RMG180: '350', RMG380: '350', RMG500: '350', RMG700: '350', RMK380: '450', RMK500: '450', RMK700: '450'},
  {id: 8, Parameter: 'CCAI', Unit: '', Limit: 'Max.', RMA10: '850', RMB30: '860', RMD80: '860', RME180: '860' ,RMG180: '870', RMG380: '870', RMG500: '870', RMG700: '870', RMK380: '870', RMK500: '870', RMK700: '870'},
  {id: 9, Parameter: 'Water', Unit: '% V/V', Limit: 'Max.', RMA10: '0.30', RMB30: '0.50', RMD80: '0.50', RME180: '0.50' ,RMG180: '0.50', RMG380: '0.50', RMG500: '0.50', RMG700: '0.50', RMK380: '0.50', RMK500: '0.50', RMK700: '0.50'},
  {id: 10, Parameter: 'Pour point (upper) in Summer', Unit: '°C', Limit: 'Max.', RMA10: '6', RMB30: '6', RMD80: '30', RME180: '30', RMG180: '30', RMG380: '30', RMG500: '30', RMG700: '30', RMK380: '30', RMK500: '30', RMK700: '30'},
  {id: 11, Parameter: 'Pour point (upper) in Winter', Unit: '°C', Limit: 'Max.', RMA10: '0', RMB30: '0', RMD80: '30', RME180: '30' ,RMG180: '30', RMG380: '30', RMG500: '30', RMG700: '30', RMK380: '30', RMK500: '30', RMK700: '30'},
  {id: 12, Parameter: 'Flash point', Unit: '°C', Limit: 'Max.', RMA10: '60.0', RMB30: '60.0', RMD80: '60.0', RME180: '60.0' ,RMG180: '60.0', RMG380: '60.0', RMG500: '60.0', RMG700: '60.0', RMK380: '60.0', RMK500: '60.0', RMK700: '60.0'},
  {id: 13, Parameter: 'Sulphur', Unit: '% m/m', Limit: 'Min.', RMA10: '*', RMB30: '*', RMD80: '*', RME180: '*' ,RMG180: '*', RMG380: '*', RMG500: '*', RMG700: '*', RMK380: '*', RMK500: '*', RMK700: '*'},
  {id: 14, Parameter: 'Total Sediment, aged', Unit: '% m/m', Limit: 'Max.', RMA10: '0.10', RMB30: '0.10', RMD80: '0.10', RME180: '0.10' ,RMG180: '0.10', RMG380: '0.10', RMG500: '0.10', RMG700: '0.10', RMK380: '0.10', RMK500: '0.10', RMK700: '0.10'},
  {id: 15, Parameter: 'Acid Number', Unit: 'mgKOH/g', Limit: 'Max.', RMA10: '2.5', RMB30: '2.5', RMD80: '2.5', RME180: '2.5' ,RMG180: '2.5', RMG380: '2.5', RMG500: '2.5', RMG700: '2.5', RMK380: '2.5', RMK500: '2.5', RMK700: '2.5'},
  {id: 16, Parameter: 'Used lubricating oils (ULO)', Unit: 'mg/kg)', Limit: 'Max.', RMA10: '#', RMB30: '#', RMD80: '#', RME180: '#' ,RMG180: '#', RMG380: '#', RMG500: '#', RMG700: '#', RMK380: '#', RMK500: '#', RMK700: '#'},
  {id: 17, Parameter: 'Hydrogen sulphide', Unit: 'mg/kg)', Limit: 'Max.', RMA10: '2.00', RMB30: '2.00', RMD80: '2.00', RME180: '2.00' ,RMG180: '2.00', RMG380: '2.00', RMG500: '2.00', RMG700: '2.00', RMK380: '2.00', RMK500: '2.00', RMK700: '2.00'},
]


  
export interface DistillateData2017 {
      id: number,
      Parameter: string,
      Unit: string,
      Limit: string,
      DMA: string,
      DMB: string,
      DMZ: string,
      DMX: string,
      DFA: string,
      DFB: string,
      DFZ: string 
  }
  
  
export interface DistillateData201220102005 {
    id: number,
    Parameter: string,
    Unit: string,
    Limit: string,
    DMA: string,
    DMB: string,
    DMZ: string,
    DMX: string,
  }


    
export interface ResidualData201720122010 {
  id: number,
  Parameter: string,
  Unit: string,
  Limit: string,
  RMA10: string,
  RMB30: string,
  RMD80: string,
  RME180: string,
  RMG180: string,
  RMG380: string,
  RMG500: string,
  RMG700: string,
  RMK380: string,
  RMK500: string,
  RMK700: string,
}


export interface ResidualData2005 {
id: number,
Parameter: string,
Unit: string,
Limit: string,
RMA30: string,
RMB30: string,
RMD80: string,
RME180: string,
RMF180: string,
RMG380: string,
RMH380: string,
RMK380: string,
RMH700: string,
RMK700: string,
}

export interface DistillateProps2017 {
    rows: DistillateData2017[]
    type: keyof DistillateData2017
  }
  
export interface DistillateProps201220102005 {
    rows: DistillateData201220102005[]
    type: keyof DistillateData201220102005
  }

  
export interface ResidualProps201720122010 {
  rows: ResidualData201720122010[]
  type: keyof ResidualData201720122010
}

export interface ResidualProps2005 {
  rows: ResidualData2005[]
  type: keyof ResidualData2005
}


export const columnDefs2017: GridColDef[] = [
  {field: 'Parameter', maxWidth:350, minWidth: 350},
  {field: 'Unit', maxWidth:90},
  {field: 'Limit', maxWidth:70},
  {field: 'DMX', maxWidth: 70},
  {field: 'DMA', maxWidth: 70},
  {field: 'DFA', maxWidth: 70},
  {field: 'DMZ', maxWidth: 70},
  {field: 'DFZ', maxWidth: 70},
  {field: 'DMB', maxWidth: 70},
  {field: 'DFB', maxWidth: 70},
];

export const columnDefs201220102005: GridColDef[] = [
  {field: 'Parameter', maxWidth: 350, minWidth: 350},
  {field: 'Unit', maxWidth:90},
  {field: 'Limit', maxWidth:70},
  {field: 'DMX', maxWidth: 70},
  {field: 'DMA', maxWidth: 70},
  {field: 'DMZ', maxWidth: 70},
  {field: 'DMB', maxWidth: 70},
];

export const columnDefsRes201720122010: GridColDef[] = [
{field: 'Parameter', maxWidth: 170, minWidth: 170},
{field: 'Unit', maxWidth:90},
{field: 'Limit', maxWidth:70},
{field: 'RMA10', maxWidth: 70},
{field: 'RMB30', maxWidth: 70},
{field: 'RMD80', maxWidth: 70},
{field: 'RME180', maxWidth: 70},
{field: 'RMG180', maxWidth: 70},
{field: 'RMG380', maxWidth: 70},
{field: 'RMG500', maxWidth: 70},
{field: 'RMG700', maxWidth: 70},
{field: 'RMK380', maxWidth: 70},
{field: 'RMK500', maxWidth: 70},
{field: 'RMK700', maxWidth: 70},
];


export const columnDefsRes2005: GridColDef[] = [
{field: 'Parameter', maxWidth: 170, minWidth: 170},
{field: 'Unit', maxWidth:90},
{field: 'Limit', maxWidth:70},
{field: 'RMA30', maxWidth: 70},
{field: 'RMB30', maxWidth: 70},
{field: 'RMD80', maxWidth: 70},
{field: 'RME180', maxWidth: 70},
{field: 'RMF180', maxWidth: 70},
{field: 'RMG380', maxWidth: 70},
{field: 'RMH380', maxWidth: 70},
{field: 'RMK380', maxWidth: 70},
{field: 'RMH700', maxWidth: 70},
{field: 'RMK700', maxWidth: 70},
];

const getKeyValue = <U extends keyof T, T extends object>(key: U) => (obj: T) =>
obj[key];


// Build a 2010 or 2005 distillate table of a given type (same data interface)
export  function DistTable201220102005( {rows, type}: DistillateProps201220102005) {
return (
 <div className='mx-auto'  style={{maxWidth: 800, padding: '50px 10px', fontSize: 13}}>
 <b><Box sx={{ borderBottom: 1, borderColor: 'contrast'}}>
    <div className = "p-1">
      <Grid container spacing={2}>
        <Grid xs={6}>Parameter</Grid><Grid xs={2}>Limit</Grid><Grid xs={2}><b>Value</b></Grid><Grid xs={2}>Unit</Grid>
      </Grid> 
    </div>
  </Box></b>
  {
    rows.map(x => {
        const fuelType = getKeyValue<keyof DistillateData201220102005, DistillateData201220102005>(type)(x);
        if (typeof fuelType === 'string' && fuelType != '-') { 
          return <SpecRow parameter={x.Parameter} limit={x.Limit} value={fuelType} unit={x.Unit}  key={x.Parameter + x.Limit}/> 
        } 
      }
    )
  } 

</div>);
}


// Build a 2017 distillate table of a given type
export function DistTable2017( {rows, type}: DistillateProps2017) {
return (
  <div className='mx-auto'  style={{maxWidth: 800, padding: '50px 10px', fontSize: 13}}>
  <b><Box sx={{ borderBottom: 1, borderColor: 'contrast'}}>
    <div className = "p-1">
      <Grid container spacing={2}>
        <Grid xs={6}>Parameter</Grid><Grid xs={2}>Limit</Grid><Grid xs={2}><b>Value</b></Grid><Grid xs={2}>Unit</Grid>
      </Grid> 
    </div>
  </Box></b>
  {
    rows.map(x => {
        const fuelType = getKeyValue<keyof DistillateData2017, DistillateData2017>(type)(x);
        if (typeof fuelType === 'string' && fuelType != '-') { 
          return <SpecRow parameter={x.Parameter} limit={x.Limit} value={fuelType} unit={x.Unit}  key={x.Parameter + x.Limit}/> 
        } 
      }
    )
  } 

</div>);
}


// Build a 2017 or 2010 residuals table of a given type (same data interface)
export  function ResTable201720122010( {rows, type}: ResidualProps201720122010) {
  return (
   <div className='mx-auto'  style={{maxWidth: 800, padding: '50px 10px', fontSize: 13}}>
   <b><Box sx={{ borderBottom: 1, borderColor: 'contrast'}}>
      <div className = "p-1">
        <Grid container spacing={2}>
          <Grid xs={6}>Parameter</Grid><Grid xs={2}>Limit</Grid><Grid xs={2}><b>Value</b></Grid><Grid xs={2}>Unit</Grid>
        </Grid> 
      </div>
    </Box></b>
    {
      rows.map(x => {
          const fuelType = getKeyValue<keyof ResidualData201720122010, ResidualData201720122010>(type)(x);
          if (typeof fuelType === 'string' && fuelType != '-') { 
            return <SpecRow parameter={x.Parameter} limit={x.Limit} value={fuelType} unit={x.Unit} key={x.Parameter + x.Limit}/>
          } 
        }
      )
    } 
  
  </div>);
  }
  
  // Build a 2005 residuals table of a given type
  export function ResTable2005( {rows, type}: ResidualProps2005) {
  return (
    <div className='mx-auto'  style={{maxWidth: 800, padding: '50px 10px', fontSize: 13}}>
    <b><Box sx={{ borderBottom: 1, borderColor: 'contrast'}}>
      <div className = "p-1">
        <Grid container spacing={2}>
          <Grid xs={6}>Parameter</Grid><Grid xs={2}>Limit</Grid><Grid xs={2}><b>Value</b></Grid><Grid xs={2}>Unit</Grid>
        </Grid> 
      </div>
    </Box></b>
    {
      rows.map(x => {
          const fuelType = getKeyValue<keyof ResidualData2005, ResidualData2005>(type)(x);
          if (typeof fuelType === 'string' && fuelType != '-') { 
            return <SpecRow parameter={x.Parameter} limit={x.Limit} value={fuelType} unit={x.Unit}  key={x.Parameter + x.Limit}/> 
          } 
        }
      )
    } 
  
  </div>);
  }
  
// Builds an individual data row for the grid
function SpecRow(row: {parameter:string, limit:string, value:string, unit:string}) {
return (
<Box sx={{ borderBottom: 1, borderColor: 'divider'}}>
<div className = "p-1">
<Grid container spacing={2}>
  <Grid xs={6}>{row.parameter}</Grid><Grid xs={2}>{row.limit}</Grid><Grid xs={2}><b>{row.value}</b></Grid><Grid xs={2}>{row.unit}</Grid>
  </Grid> </div></Box>
  );
}
