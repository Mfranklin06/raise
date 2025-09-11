"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function criarSalaAction(formData: FormData) {
  const nome = formData.get("nome") as string;
  const location = formData.get("location") as string;
  const brand_model = formData.get("brand_model") as string;

  const response = await fetch("https://raise-eight.vercel.app/api/salas", {
    method: "POST",
    headers: {
        "Content-Type": "application/json",
    },
    body: JSON.stringify(        { 
            name: nome, 
            location: location,
            brand_model: brand_model,
        }
    ),
});
    if (!response.ok) {
        throw new Error("Erro ao criar a sala");
    }

    revalidatePath('/');
    // Redirect to home page
    redirect('/');
};
