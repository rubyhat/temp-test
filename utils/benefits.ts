import AcUnitIcon from '@material-ui/icons/AcUnit';
import AirlineSeatReclineExtraIcon from '@material-ui/icons/AirlineSeatReclineExtra';
import BatteryChargingFullIcon from '@material-ui/icons/BatteryChargingFull';
import ChildFriendlyIcon from '@material-ui/icons/ChildFriendly';
import DoneIcon from '@material-ui/icons/Done';
import LocalCafeIcon from '@material-ui/icons/LocalCafe';
import LocalHospitalIcon from '@material-ui/icons/LocalHospital';
import PowerIcon from '@material-ui/icons/Power';
import ReceiptIcon from '@material-ui/icons/Receipt';
import SpeedIcon from '@material-ui/icons/Speed';
import TvIcon from '@material-ui/icons/Tv';
import WifiIcon from '@material-ui/icons/Wifi';
import { FC } from 'react';
import { SvgIconProps } from '@material-ui/core/SvgIcon';

import BigBusIcon from 'components/icons/BigBus';
import MeteorIcon from 'components/icons/Meteor';

// @todo Backend type
export type RideBenefit =
    | 'child-seat'
    | 'tv'
    | 'charger'
    | 'wifi'
    | '220v'
    | 'express'
    | 'no-ticket-required'
    | 'armch'
    | 'air'
    | 'coffee'
    | 'press'
    | 'desinfection'
    | 'big-bus'
    | 'meteor';

export const benefitsIconsMap: Record<RideBenefit, FC<SvgIconProps>> = {
    'child-seat': ChildFriendlyIcon,
    tv: TvIcon,
    charger: BatteryChargingFullIcon,
    wifi: WifiIcon,
    '220v': PowerIcon,
    express: SpeedIcon,
    'no-ticket-required': ReceiptIcon,
    armch: AirlineSeatReclineExtraIcon,
    air: AcUnitIcon,
    coffee: LocalCafeIcon,
    press: DoneIcon,
    desinfection: LocalHospitalIcon,
    'big-bus': BigBusIcon,
    meteor: MeteorIcon,
};
