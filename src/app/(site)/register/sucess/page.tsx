import { redirect } from 'next/navigation';

/** Laravel typo route parity: `/register/sucess` → `/register/success` */
export default function RegisterSucessRedirect() {
  redirect('/register/success');
}
