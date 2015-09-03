"use strict";

var channels = {};

(function() {
  var preset = {};

  preset['1-13'] = {
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

  preset['1-13,36-48'] = {
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

  preset['1-13,149-161'] = {
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

  preset['1-13,149-165'] = {
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

  preset['1-13,36-48,149-161'] = {
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

  preset['1-13,36-48,149-165'] = {
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

  preset['1-13,36-64,149-165'] = {
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

  preset['1-13,36-48,132-140,149-161'] = {
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

  preset['1-11,149-165'] = {
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

  preset['1-11,36-48,149-165'] = {
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

  preset['1-11,36-64,149-165'] = {
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

  channels['AE'] = preset['1-13,36-48'];
  channels['AL'] = preset['1-13'];
  channels['AM'] = preset['1-13,36-48'];
  channels['AN'] = preset['1-13,36-48'];
  channels['AR'] = preset['1-13,36-48,149-165'];
  channels['AT'] = preset['1-13,36-48'];
  channels['AU'] = preset['1-13,36-48,149-165'];
  channels['AW'] = preset['1-13,36-48'];
  channels['AZ'] = preset['1-13,36-48'];
  channels['BA'] = preset['1-13,36-48'];
  channels['BB'] = preset['1-13,36-64,149-165'];
  channels['BD'] = preset['1-13'];
  channels['BE'] = preset['1-13,36-48'];
  channels['BG'] = preset['1-13,36-48'];
  channels['BH'] = preset['1-13,36-48,149-165'];
  channels['BN'] = preset['1-13,36-48,149-165'];
  channels['BO'] = preset['1-13,149-165'];
  channels['BR'] = preset['1-13,36-48,149-165'];
  channels['BY'] = preset['1-13,36-48'];
  channels['BZ'] = preset['1-13,149-165'];
  channels['CA'] = preset['1-11,36-48,149-165'];
  channels['CH'] = preset['1-13,36-48'];
  channels['CL'] = preset['1-13,36-48,149-165'];
  channels['CN'] = preset['1-13,149-165'];
  channels['CO'] = preset['1-11,36-64,149-165'];
  channels['CR'] = preset['1-13,36-64,149-165'];
  channels['CY'] = preset['1-13,36-48'];
  channels['CZ'] = preset['1-13,36-48'];
  channels['DE'] = preset['1-13,36-48'];
  channels['DK'] = preset['1-13,36-48'];
  channels['DO'] = preset['1-11,36-64,149-165'];
  channels['DZ'] = preset['1-13'];
  channels['EC'] = preset['1-13,36-64,149-165'];
  channels['EE'] = preset['1-13,36-48'];
  channels['EG'] = preset['1-13,36-48'];
  channels['ES'] = preset['1-13,36-48'];
  channels['FI'] = preset['1-13,36-48'];
  channels['FR'] = preset['1-13,36-48'];
  channels['GB'] = preset['1-13,36-48'];
  channels['GD'] = preset['1-11,36-48,149-165'];
  channels['GE'] = preset['1-13,36-48'];
  channels['GL'] = preset['1-13,36-48'];
  channels['GR'] = preset['1-13,36-48'];
  channels['GT'] = preset['1-11,36-64,149-165'];
  channels['GU'] = preset['1-11,36-64,149-165'];
  channels['HK'] = preset['1-13,36-48,149-165'];
  channels['HN'] = preset['1-13,36-48,149-165'];
  channels['HR'] = preset['1-13,36-48'];
  channels['HT'] = preset['1-13,36-48'];
  channels['HU'] = preset['1-13,36-48'];
  channels['ID'] = preset['1-13,149-161'];
  channels['IE'] = preset['1-13,36-48'];
  channels['IL'] = preset['1-13,36-48'];
  channels['IN'] = preset['1-13,36-48,149-165'];
  channels['IR'] = preset['1-13,149-165'];
  channels['IS'] = preset['1-13,36-48'];
  channels['IT'] = preset['1-13,36-48'];
  channels['JM'] = preset['1-13,36-48,149-165'];
  channels['JO'] = preset['1-13,36-48'];
  channels['JP'] = preset['1-13,36-48'];
  channels['KE'] = preset['1-13,149-165'];
  channels['KH'] = preset['1-13,36-48'];
  channels['KP'] = preset['1-13,36-48,149-161'];
  channels['KR'] = preset['1-13,36-48,149-161'];
  channels['KW'] = preset['1-13,36-48'];
  channels['KZ'] = preset['1-13'];
  channels['LB'] = preset['1-13,149-165'];
  channels['LI'] = preset['1-13,36-48'];
  channels['LK'] = preset['1-13,36-48,149-165'];
  channels['LT'] = preset['1-13,36-48'];
  channels['LU'] = preset['1-13,36-48'];
  channels['LV'] = preset['1-13,36-48'];
  channels['MA'] = preset['1-13,36-48,149-165'];
  channels['MC'] = preset['1-13,36-48'];
  channels['ME'] = preset['1-13,36-48'];
  channels['MK'] = preset['1-13,36-48'];
  channels['MO'] = preset['1-13,36-64,149-165'];
  channels['MT'] = preset['1-13,36-48'];
  channels['MX'] = preset['1-11,36-64,149-165'];
  channels['MY'] = preset['1-13,36-64,149-165'];
  channels['NL'] = preset['1-13,36-48'];
  channels['NO'] = preset['1-13,36-48'];
  channels['NP'] = preset['1-13,149-165'];
  channels['NZ'] = preset['1-13,36-64,149-165'];
  channels['OM'] = preset['1-13,36-48,149-165'];
  channels['PA'] = preset['1-11,36-64,149-165'];
  channels['PE'] = preset['1-13,36-48,149-165'];
  channels['PG'] = preset['1-13,36-64,149-165'];
  channels['PH'] = preset['1-13,36-48,149-165'];
  channels['PK'] = preset['1-13,149-165'];
  channels['PL'] = preset['1-13,36-48'];
  channels['PR'] = preset['1-11,36-64,149-165'];
  channels['PT'] = preset['1-13,36-48'];
  channels['QA'] = preset['1-13,149-165'];
  channels['RO'] = preset['1-13,36-48'];
  channels['RS'] = preset['1-13,36-48'];
  channels['RU'] = preset['1-13,36-48,132-140,149-161'];
  channels['RW'] = preset['1-13,149-165'];
  channels['SA'] = preset['1-13,36-64,149-165'];
  channels['SE'] = preset['1-13,36-48'];
  channels['SG'] = preset['1-13,36-48,149-165'];
  channels['SI'] = preset['1-13,36-48'];
  channels['SK'] = preset['1-13,36-48'];
  channels['SV'] = preset['1-13,36-64,149-165'];
  channels['SY'] = preset['1-13'];
  channels['TH'] = preset['1-13,36-48,149-165'];
  channels['TN'] = preset['1-13,36-48'];
  channels['TR'] = preset['1-13,36-48'];
  channels['TT'] = preset['1-13,36-48,149-165'];
  channels['TW'] = preset['1-11,149-165'];
  channels['UA'] = preset['1-13,36-48,149-165'];
  channels['US'] = preset['1-11,36-48,149-165'];
  channels['UY'] = preset['1-13,36-48,149-165'];
  channels['UZ'] = preset['1-11,36-48,149-165'];
  channels['VE'] = preset['1-13,36-64,149-165'];
  channels['VN'] = preset['1-13,36-48'];
  channels['YE'] = preset['1-13'];
  channels['ZA'] = preset['1-13,36-48,149-165'];
  channels['ZW'] = preset['1-13'];

})();
