"use server";
import { plaidClient } from "@/lib/plaid";
import { Premium, User } from "@prisma/client";
import { CountryCode, Products } from "plaid";

interface ExtendedUser extends User {
  Premium: Premium[];
}

export const createPlaidLinkToken = async (user: User) => {
  if (!user || !user.id || !user.name) {
    return {
      error: "User not found",
    };
  }

  try {
    const tokenParams = {
      user: {
        client_user_id: user.id,
      },
      client_name: user.name,
      products: ["auth"] as Products[],
      language: "en",
      country_codes: ["US"] as CountryCode[],
    };

    const response = await plaidClient.linkTokenCreate(tokenParams);

    return {
      link_token: response.data.link_token,
    };
  } catch (error) {
    console.log(error);
    return {
      error: "Error creating Plaid link token",
    };
  }
};

export const exchangePublicToken = async ({
  publicToken,
  user,
}: {
  publicToken: string;
  user: ExtendedUser;
}) => {
  if (!user || !user.id) {
    return {
      error: "User not found",
    };
  }

  if (!user.Premium.length || !user.Premium[0].active) {
    return {
      error: "Please upgrade to premium to use this feature",
    };
  }

  try {
    const response = await plaidClient.itemPublicTokenExchange({
      public_token: publicToken,
    });

    return {
      access_token: response.data.access_token,
      item_id: response.data.item_id,
    };
  } catch (error) {
    console.log(error);
    return {
      error: "Error exchanging public token",
    };
  }
};
