"use strict";

var channels = {};

channels.presets = {};

channels.presets['1-13'] = {
  '1': true,
  '2': true,
  '3': true,
  '4': true,
  '5': true,
  '6': true,
  '7': true,
  '8': true,
  '9': true,
  '10': true,
  '11': true,
  '12': true,
  '13': true,
  '14': false,

  '34': false,
  '36': false,
  '38': false,
  '40': false,
  '42': false,
  '44': false,
  '46': false,
  '48': false,

  '52': false,
  '56': false,
  '60': false,
  '64': false,

  '100': false,
  '104': false,
  '108': false,
  '112': false,
  '116': false,
  '120': false,
  '124': false,
  '128': false,
  '132': false,
  '136': false,
  '140': false,

  '149': false,
  '153': false,
  '157': false,
  '161': false,
  '165': false
};

channels.presets['1-13,36-48'] = {
  '1': true,
  '2': true,
  '3': true,
  '4': true,
  '5': true,
  '6': true,
  '7': true,
  '8': true,
  '9': true,
  '10': true,
  '11': true,
  '12': true,
  '13': true,
  '14': false,

  '34': false,
  '36': true,
  '38': false,
  '40': true,
  '42': false,
  '44': true,
  '46': false,
  '48': true,

  '52': false,
  '56': false,
  '60': false,
  '64': false,

  '100': false,
  '104': false,
  '108': false,
  '112': false,
  '116': false,
  '120': false,
  '124': false,
  '128': false,
  '132': false,
  '136': false,
  '140': false,

  '149': false,
  '153': false,
  '157': false,
  '161': false,
  '165': false
};

channels.presets['1-13,149-161'] = {
  '1': true,
  '2': true,
  '3': true,
  '4': true,
  '5': true,
  '6': true,
  '7': true,
  '8': true,
  '9': true,
  '10': true,
  '11': true,
  '12': true,
  '13': true,
  '14': false,

  '34': false,
  '36': false,
  '38': false,
  '40': false,
  '42': false,
  '44': false,
  '46': false,
  '48': false,

  '52': false,
  '56': false,
  '60': false,
  '64': false,

  '100': false,
  '104': false,
  '108': false,
  '112': false,
  '116': false,
  '120': false,
  '124': false,
  '128': false,
  '132': false,
  '136': false,
  '140': false,

  '149': true,
  '153': true,
  '157': true,
  '161': true,
  '165': false
};

channels.presets['1-13,149-165'] = {
  '1': true,
  '2': true,
  '3': true,
  '4': true,
  '5': true,
  '6': true,
  '7': true,
  '8': true,
  '9': true,
  '10': true,
  '11': true,
  '12': true,
  '13': true,
  '14': false,

  '34': false,
  '36': false,
  '38': false,
  '40': false,
  '42': false,
  '44': false,
  '46': false,
  '48': false,

  '52': false,
  '56': false,
  '60': false,
  '64': false,

  '100': false,
  '104': false,
  '108': false,
  '112': false,
  '116': false,
  '120': false,
  '124': false,
  '128': false,
  '132': false,
  '136': false,
  '140': false,

  '149': true,
  '153': true,
  '157': true,
  '161': true,
  '165': true
};

channels.presets['1-13,36-48,149-161'] = {
  '1': true,
  '2': true,
  '3': true,
  '4': true,
  '5': true,
  '6': true,
  '7': true,
  '8': true,
  '9': true,
  '10': true,
  '11': true,
  '12': true,
  '13': true,
  '14': false,

  '34': false,
  '36': true,
  '38': false,
  '40': true,
  '42': false,
  '44': true,
  '46': false,
  '48': true,

  '52': false,
  '56': false,
  '60': false,
  '64': false,

  '100': false,
  '104': false,
  '108': false,
  '112': false,
  '116': false,
  '120': false,
  '124': false,
  '128': false,
  '132': false,
  '136': false,
  '140': false,

  '149': true,
  '153': true,
  '157': true,
  '161': true,
  '165': false
};

channels.presets['1-13,36-48,149-165'] = {
  '1': true,
  '2': true,
  '3': true,
  '4': true,
  '5': true,
  '6': true,
  '7': true,
  '8': true,
  '9': true,
  '10': true,
  '11': true,
  '12': true,
  '13': true,
  '14': false,

  '34': false,
  '36': true,
  '38': false,
  '40': true,
  '42': false,
  '44': true,
  '46': false,
  '48': true,

  '52': false,
  '56': false,
  '60': false,
  '64': false,

  '100': false,
  '104': false,
  '108': false,
  '112': false,
  '116': false,
  '120': false,
  '124': false,
  '128': false,
  '132': false,
  '136': false,
  '140': false,

  '149': true,
  '153': true,
  '157': true,
  '161': true,
  '165': true
};

channels.presets['1-13,36-64,149-165'] = {
  '1': true,
  '2': true,
  '3': true,
  '4': true,
  '5': true,
  '6': true,
  '7': true,
  '8': true,
  '9': true,
  '10': true,
  '11': true,
  '12': true,
  '13': true,
  '14': false,

  '34': false,
  '36': true,
  '38': false,
  '40': true,
  '42': false,
  '44': true,
  '46': false,
  '48': true,

  '52': true,
  '56': true,
  '60': true,
  '64': true,

  '100': false,
  '104': false,
  '108': false,
  '112': false,
  '116': false,
  '120': false,
  '124': false,
  '128': false,
  '132': false,
  '136': false,
  '140': false,

  '149': true,
  '153': true,
  '157': true,
  '161': true,
  '165': true
};

channels.presets['1-13,36-48,132-140,149-161'] = {
  '1': true,
  '2': true,
  '3': true,
  '4': true,
  '5': true,
  '6': true,
  '7': true,
  '8': true,
  '9': true,
  '10': true,
  '11': true,
  '12': true,
  '13': true,
  '14': false,

  '34': false,
  '36': true,
  '38': false,
  '40': true,
  '42': false,
  '44': true,
  '46': false,
  '48': true,

  '52': false,
  '56': false,
  '60': false,
  '64': false,

  '100': false,
  '104': false,
  '108': false,
  '112': false,
  '116': false,
  '120': false,
  '124': false,
  '128': false,
  '132': true,
  '136': true,
  '140': true,

  '149': true,
  '153': true,
  '157': true,
  '161': true,
  '165': false
};

channels.presets['1-11,149-165'] = {
  '1': true,
  '2': true,
  '3': true,
  '4': true,
  '5': true,
  '6': true,
  '7': true,
  '8': true,
  '9': true,
  '10': true,
  '11': true,
  '12': false,
  '13': false,
  '14': false,

  '34': false,
  '36': false,
  '38': false,
  '40': false,
  '42': false,
  '44': false,
  '46': false,
  '48': false,

  '52': false,
  '56': false,
  '60': false,
  '64': false,

  '100': false,
  '104': false,
  '108': false,
  '112': false,
  '116': false,
  '120': false,
  '124': false,
  '128': false,
  '132': false,
  '136': false,
  '140': false,

  '149': true,
  '153': true,
  '157': true,
  '161': true,
  '165': true
};

channels.presets['1-11,36-48,149-165'] = {
  '1': true,
  '2': true,
  '3': true,
  '4': true,
  '5': true,
  '6': true,
  '7': true,
  '8': true,
  '9': true,
  '10': true,
  '11': true,
  '12': false,
  '13': false,
  '14': false,

  '34': false,
  '36': true,
  '38': false,
  '40': true,
  '42': false,
  '44': true,
  '46': false,
  '48': true,

  '52': false,
  '56': false,
  '60': false,
  '64': false,

  '100': false,
  '104': false,
  '108': false,
  '112': false,
  '116': false,
  '120': false,
  '124': false,
  '128': false,
  '132': false,
  '136': false,
  '140': false,

  '149': true,
  '153': true,
  '157': true,
  '161': true,
  '165': true
};

channels.presets['1-11,36-64,149-165'] = {
  '1': true,
  '2': true,
  '3': true,
  '4': true,
  '5': true,
  '6': true,
  '7': true,
  '8': true,
  '9': true,
  '10': true,
  '11': true,
  '12': false,
  '13': false,
  '14': false,

  '34': false,
  '36': true,
  '38': false,
  '40': true,
  '42': false,
  '44': true,
  '46': false,
  '48': true,

  '52': true,
  '56': true,
  '60': true,
  '64': true,

  '100': false,
  '104': false,
  '108': false,
  '112': false,
  '116': false,
  '120': false,
  '124': false,
  '128': false,
  '132': false,
  '136': false,
  '140': false,

  '149': true,
  '153': true,
  '157': true,
  '161': true,
  '165': true
};


channels['AE'] = channels.presets['1-13,36-48'];
channels['AL'] = channels.presets['1-13'];
channels['AM'] = channels.presets['1-13,36-48'];
channels['AN'] = channels.presets['1-13,36-48'];
channels['AR'] = channels.presets['1-13,36-48,149-165'];
channels['AT'] = channels.presets['1-13,36-48'];
channels['AU'] = channels.presets['1-13,36-48,149-165'];
channels['AW'] = channels.presets['1-13,36-48'];
channels['AZ'] = channels.presets['1-13,36-48'];
channels['BA'] = channels.presets['1-13,36-48'];
channels['BB'] = channels.presets['1-13,36-64,149-165'];
channels['BD'] = channels.presets['1-13'];
channels['BE'] = channels.presets['1-13,36-48'];
channels['BG'] = channels.presets['1-13,36-48'];
channels['BH'] = channels.presets['1-13,36-48,149-165'];
channels['BN'] = channels.presets['1-13,36-48,149-165'];
channels['BO'] = channels.presets['1-13,149-165'];
channels['BR'] = channels.presets['1-13,36-48,149-165'];
channels['BY'] = channels.presets['1-13,36-48'];
channels['BZ'] = channels.presets['1-13,149-165'];
channels['CA'] = channels.presets['1-11,36-48,149-165'];
channels['CH'] = channels.presets['1-13,36-48'];
channels['CL'] = channels.presets['1-13,36-48,149-165'];
channels['CN'] = channels.presets['1-13,149-165'];
channels['CO'] = channels.presets['1-11,36-64,149-165'];
channels['CR'] = channels.presets['1-13,36-64,149-165'];
channels['CY'] = channels.presets['1-13,36-48'];
channels['CZ'] = channels.presets['1-13,36-48'];
channels['DE'] = channels.presets['1-13,36-48'];
channels['DK'] = channels.presets['1-13,36-48'];
channels['DO'] = channels.presets['1-11,36-64,149-165'];
channels['DZ'] = channels.presets['1-13'];
channels['EC'] = channels.presets['1-13,36-64,149-165'];
channels['EE'] = channels.presets['1-13,36-48'];
channels['EG'] = channels.presets['1-13,36-48'];
channels['ES'] = channels.presets['1-13,36-48'];
channels['FI'] = channels.presets['1-13,36-48'];
channels['FR'] = channels.presets['1-13,36-48'];
channels['GB'] = channels.presets['1-13,36-48'];
channels['GD'] = channels.presets['1-11,36-48,149-165'];
channels['GE'] = channels.presets['1-13,36-48'];
channels['GL'] = channels.presets['1-13,36-48'];
channels['GR'] = channels.presets['1-13,36-48'];
channels['GT'] = channels.presets['1-11,36-64,149-165'];
channels['GU'] = channels.presets['1-11,36-64,149-165'];
channels['HK'] = channels.presets['1-13,36-48,149-165'];
channels['HN'] = channels.presets['1-13,36-48,149-165'];
channels['HR'] = channels.presets['1-13,36-48'];
channels['HT'] = channels.presets['1-13,36-48'];
channels['HU'] = channels.presets['1-13,36-48'];
channels['ID'] = channels.presets['1-13,149-161'];
channels['IE'] = channels.presets['1-13,36-48'];
channels['IL'] = channels.presets['1-13,36-48'];
channels['IN'] = channels.presets['1-13,36-48,149-165'];
channels['IR'] = channels.presets['1-13,149-165'];
channels['IS'] = channels.presets['1-13,36-48'];
channels['IT'] = channels.presets['1-13,36-48'];
channels['JM'] = channels.presets['1-13,36-48,149-165'];
channels['JO'] = channels.presets['1-13,36-48'];
channels['JP'] = channels.presets['1-13,36-48'];
channels['KE'] = channels.presets['1-13,149-165'];
channels['KH'] = channels.presets['1-13,36-48'];
channels['KP'] = channels.presets['1-13,36-48,149-161'];
channels['KR'] = channels.presets['1-13,36-48,149-161'];
channels['KW'] = channels.presets['1-13,36-48'];
channels['KZ'] = channels.presets['1-13'];
channels['LB'] = channels.presets['1-13,149-165'];
channels['LI'] = channels.presets['1-13,36-48'];
channels['LK'] = channels.presets['1-13,36-48,149-165'];
channels['LT'] = channels.presets['1-13,36-48'];
channels['LU'] = channels.presets['1-13,36-48'];
channels['LV'] = channels.presets['1-13,36-48'];
channels['MA'] = channels.presets['1-13,36-48,149-165'];
channels['MC'] = channels.presets['1-13,36-48'];
channels['ME'] = channels.presets['1-13,36-48'];
channels['MK'] = channels.presets['1-13,36-48'];
channels['MO'] = channels.presets['1-13,36-64,149-165'];
channels['MT'] = channels.presets['1-13,36-48'];
channels['MX'] = channels.presets['1-11,36-64,149-165'];
channels['MY'] = channels.presets['1-13,36-64,149-165'];
channels['NL'] = channels.presets['1-13,36-48'];
channels['NO'] = channels.presets['1-13,36-48'];
channels['NP'] = channels.presets['1-13,149-165'];
channels['NZ'] = channels.presets['1-13,36-64,149-165'];
channels['OM'] = channels.presets['1-13,36-48,149-165'];
channels['PA'] = channels.presets['1-11,36-64,149-165'];
channels['PE'] = channels.presets['1-13,36-48,149-165'];
channels['PG'] = channels.presets['1-13,36-64,149-165'];
channels['PH'] = channels.presets['1-13,36-48,149-165'];
channels['PK'] = channels.presets['1-13,149-165'];
channels['PL'] = channels.presets['1-13,36-48'];
channels['PR'] = channels.presets['1-11,36-64,149-165'];
channels['PT'] = channels.presets['1-13,36-48'];
channels['QA'] = channels.presets['1-13,149-165'];
channels['RO'] = channels.presets['1-13,36-48'];
channels['RS'] = channels.presets['1-13,36-48'];
channels['RU'] = channels.presets['1-13,36-48,132-140,149-161'];
channels['RW'] = channels.presets['1-13,149-165'];
channels['SA'] = channels.presets['1-13,36-64,149-165'];
channels['SE'] = channels.presets['1-13,36-48'];
channels['SG'] = channels.presets['1-13,36-48,149-165'];
channels['SI'] = channels.presets['1-13,36-48'];
channels['SK'] = channels.presets['1-13,36-48'];
channels['SV'] = channels.presets['1-13,36-64,149-165'];
channels['SY'] = channels.presets['1-13'];
channels['TH'] = channels.presets['1-13,36-48,149-165'];
channels['TN'] = channels.presets['1-13,36-48'];
channels['TR'] = channels.presets['1-13,36-48'];
channels['TT'] = channels.presets['1-13,36-48,149-165'];
channels['TW'] = channels.presets['1-11,149-165'];
channels['UA'] = channels.presets['1-13,36-48,149-165'];
channels['US'] = channels.presets['1-11,36-48,149-165'];
channels['UY'] = channels.presets['1-13,36-48,149-165'];
channels['UZ'] = channels.presets['1-11,36-48,149-165'];
channels['VE'] = channels.presets['1-13,36-64,149-165'];
channels['VN'] = channels.presets['1-13,36-48'];
channels['YE'] = channels.presets['1-13'];
channels['ZA'] = channels.presets['1-13,36-48,149-165'];
channels['ZW'] = channels.presets['1-13'];