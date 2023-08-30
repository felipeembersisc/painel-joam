export default function (value, defaultValue = '') {
    if (value) {
      value = value.replace(/[^\d]/g, '');
      if (value.length > 8) value = defaultValue;
  
      if (value) {
        switch (value.length) {
          case 1:
          case 2:
          case 3:
          case 4:
          case 5:
            break;
  
          case 6:
          case 7:
            value = value.replace(/^(\d{5})/, '$1-');
            break;
  
          default:
            value = value.replace(/^(\d{5})(\d{3})/, '$1-$2');
            break;
        }
      }
    }
  
    return value;
  }
  