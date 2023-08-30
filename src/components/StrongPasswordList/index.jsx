import { CheckListSenha } from "./styles"

export function StrongPasswordList({ senha, onChange, iconSize }){
   return (
      <CheckListSenha
         rules={["minLength","specialChar","number","lowercase","capital"]}
         minLength={9}
         value={senha ?? ""}
         onChange={onChange}
         messages={{
            minLength: "A senha precisa ter pelo menos 9 caracteres.",
            specialChar: "A senha precisa ter pelo menos 1 caracter especial",
            number: "A senha precisa ter pelo menos 1 número",
            lowercase: "A senha precisa ter pelo menos 1 letra minúscula",
            capital: "A senha precisa ter pelo menos 1 letra maiúscula",
         }}
         iconSize={iconSize ?? 14}
      />
   )
}