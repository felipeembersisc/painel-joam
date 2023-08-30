import styled from 'styled-components';
import PasswordChecklist from "react-password-checklist"

export const CheckListSenha = styled(PasswordChecklist)`
   margin-top: 1rem;

   li {
      align-items: center;
      padding: 1px 0.5rem;
      
      span {
         padding-left: 5px;
         flex: 1;
      }
   }
`