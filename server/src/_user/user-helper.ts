import {
  GITHUB_CLIENT_ID,
  GITHUB_CLIENT_SECRET,
  GITHUB_TOKEN_API,
  GITHUB_USER_API,
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  GOOGLE_REDIRECT_URI,
  GOOGLE_TOKEN_API,
  GOOGLE_USER_API,
} from "@/utils/constants";
import { ErrorResponse } from "@/utils/dto";
import axios from "axios";
import { Response } from "express";

export const authenticateWithLogin = async (code: string, res: Response) => {
  const tokenResponse = await axios.post(GOOGLE_TOKEN_API, {
    client_id: GOOGLE_CLIENT_ID,
    client_secret: GOOGLE_CLIENT_SECRET,
    redirect_uri: GOOGLE_REDIRECT_URI,
    grant_type: "authorization_code",
    code,
  });

  const googleAccessToken = tokenResponse.data.access_token as string;

  const { data } = await axios.get(GOOGLE_USER_API, {
    headers: {
      Authorization: `Bearer ${googleAccessToken}`,
    },
  });

  if (!data || !data.email) {
    res.status(401).json(new ErrorResponse(401, "Invalid credentials"));
    return;
  }

  return data;
};

export const authenticateWithGithub = async (code: string, res: Response) => {
  const tokenResponse = await axios.post(
    GITHUB_TOKEN_API,
    {
      client_id: GITHUB_CLIENT_ID,
      client_secret: GITHUB_CLIENT_SECRET,
      code,
    },
    {
      headers: {
        Accept: "application/json",
      },
    }
  );

  const githubAccessToken = tokenResponse.data.access_token as string;

  const { data } = await axios.get(GITHUB_USER_API, {
    headers: {
      Authorization: `Bearer ${githubAccessToken}`,
    },
  });

  if (!data || !data.email) {
    res.status(401).json(new ErrorResponse(401, "Invalid credentials"));
    return;
  }

  return data;
};
