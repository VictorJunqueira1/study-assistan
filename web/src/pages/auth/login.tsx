import { z } from "zod";
import "@/app/globals.css";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from '../../lib/firebase';
import { useRouter } from 'next/navigation';
import { useState } from "react";

const formSchema = z.object({
  username: z.string().min(2, {
    message: "Este campo é obrigatório."
  }).max(16, {
    message: "Campo inválido, preencha corretamente."
  }),
  password: z.string().min(2, {
    message: "Este campo é obrigatório."
  }).max(16, {
    message: "Campo inválido, preencha corretamente."
  }),
});

type FormSchemaType = z.infer<typeof formSchema>;

const Login: React.FC = () => {
  const router = useRouter();
  const form = useForm<FormSchemaType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function onSubmit(values: FormSchemaType) {
    try {
      const { username, password } = values;
      await signInWithEmailAndPassword(auth, username, password);
      router.push('/');
    } catch (error) {
      setErrorMessage("Credenciais inválidas. Tente novamente.");
    }
  }

  return (
    <div className="bg-slate-950 text-white">
      <div className="max-w-7xl min-h-screen mx-auto flex items-center justify-center">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="w-full max-w-xs">
            <h1 className="mb-6 text-4xl font-bold text-center">Bem-vindo</h1>
            <div className="space-y-3">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome de Usuário</FormLabel>
                    <FormControl>
                      <Input placeholder="Insira seu nome" className="py-5 border-blue-800 placeholder:text-gray-300" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Senha</FormLabel>
                    <FormControl>
                      <Input placeholder="Insira sua senha" type="password" className="py-5 border-blue-800 placeholder:text-gray-300" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <Button type="submit" variant={"loginButton"} className="py-5">Entrar</Button>
            {errorMessage && <p className="text-red-500 text-center">{errorMessage}</p>}
          </form>
        </Form>
      </div>
    </div>
  );
}

export default Login;