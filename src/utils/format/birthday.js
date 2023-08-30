export default function (value, defaultValue = '') {
    if (value) {
      value = value.replace(/[^\d]/g, '');
      if (value.length > 8) value = defaultValue;
  
      switch (value.length) {
        case 1:
        case 2:
          break;
  
        case 3:
        case 4:
          value = value.replace(/^(\d{2})/, '$1/');
          break;
  
        case 5:
        case 6:
          value = value.replace(/^(\d{2})(\d{2})/, '$1/$2/');
          break;
  
        default:
          value = value.replace(/^(\d{2})(\d{2})(\d{2})/, '$1/$2/$3');
          break;
      }
      return value;
    }
  }
  