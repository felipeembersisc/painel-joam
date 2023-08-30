export default function (value, defaultValue = '') {
    if (value) {
      value = value.replace(/(\.|\/|\-)/g, '');
      if (value.length > 14) value = defaultValue;
      switch (value.length) {
        case 1:
        case 2:
        case 3:
          break;
  
        case 4:
        case 5:
        case 6:
          value = value.replace(/^(\d{3})/, '$1.');
          break;
  
        case 7:
        case 8:
        case 9:
          value = value.replace(/^(\d{3})(\d{3})/, '$1.$2.');
          break;
        case 10:
        case 11:
          value = value.replace(/^(\d{3})(\d{3})(\d{3})/, '$1.$2.$3-');
          break;
        case 12:
        case 13:
        case 14:
          value = value.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/g,'\$1.\$2.\$3\/\$4\-\$5');
          break;
        default: 
          value = value.replace(/^(\d{3})(\d{3})(\d{3})/, '$1.$2.$3-');
          break;
      }
      return value;
    }
  }
  