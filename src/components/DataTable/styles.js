import styled from 'styled-components'

export const Container = styled.div`
   width: 100%;

   .btnLimparFiltro {
      display: flex;
      align-items: center;
      background: var(--primary);
      border: 0;
      padding: 0.25rem 1rem;
      border-radius: 8px;
      color: #FFF;
      font-size: 0.8rem;
      margin-right: 0.5rem;

      transition: filter 0.2s;

      &:hover{
         filter: brightness(0.8);
      }

      svg {
         font-size: 1.25rem;
      }
   }
`