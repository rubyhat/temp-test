import { MuiPickersOverrides } from 'material-ui-pickers/typings/overrides';
import { AtlasTheme } from './atlas-theme';

type overridesNameToClassKey = {
    [P in keyof MuiPickersOverrides]: keyof MuiPickersOverrides[P];
};

declare module '@material-ui/core/styles/overrides' {
    export interface ComponentNameToClassKey extends overridesNameToClassKey {}
}

declare module '@material-ui/core/styles/createMuiTheme' {
    export interface ThemeOptions extends AtlasTheme {}
    export interface Theme extends AtlasTheme {}
}
