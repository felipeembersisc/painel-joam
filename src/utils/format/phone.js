export default function (value, defaultValue = '') {
    if (value) {
      value = value.replace(/[^\d]/g, '');
      if (value.length > 11) value = defaultValue;
  
      if (value) {
        switch (value.length) {
          case 1:
          case 2:
            value = `(${value}`;
            break;
  
          case 3:
          case 4:
          case 5:
          case 6:
            value = value.replace(/^(\d{2})/, '($1) ');
            break;
  
          case 11:
            value = value.replace(/^(\d{2})(\d{5})/, '($1) $2-');
            break;
  
          default:
            value = value.replace(/^(\d{2})(\d{4})/, '($1) $2-');
            break;
        }
      }
    }
  
    return value;
}
  