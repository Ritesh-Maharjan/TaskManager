"use server";
import * as z from "zod";
import bcrypt from "bcryptjs";
import { LoginSchema } from "@/schema/index";
import { getUserByEmail } from "@/data/user";
import { lucia } from "@/lib/auth";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";

export const login = async (values: z.infer<typeof LoginSchema>) => {
  const validatedFields = LoginSchema.safeParse(values);

  const headersList = headers();
  const referer = headersList.get("referer"); // Get the full URL from the referer header
  const url = new URL(referer!); // conver the full url from string to url
  const searchParams = new URLSearchParams(url.search); // grabs the search params

  if (!validatedFields.success) {
    // If validation is successful, safeParse returns an object with success: true and the data
    return { error: "Invalid fields" };
  }

  const { email, password } = validatedFields.data;
  const existingUser = await getUserByEmail(email);

  if (!existingUser) {
    return { error: "Incorrect email or password" };
  }

  const validPassword = await bcrypt.compare(password, existingUser.password);

  if (!validPassword) {
    return { error: "Incorrect email or password" };
  }

  // create lucia session
  const session = await lucia.createSession(existingUser.id, {});

  // set the cookies in the browser
  const sessionCookie = lucia.createSessionCookie(session.id);

  cookies().set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes
  );

  // if user come from different url, go to that url else go to our projects
  if (searchParams.get("next")) {
    return redirect(`/project/invite/${searchParams.get("next")}`);
  } else {
    return redirect("/project");
  }
};
