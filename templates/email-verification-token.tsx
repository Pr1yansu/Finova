import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Text,
  Button,
} from "@react-email/components";
import * as React from "react";

export const VerificationEmail = ({
  verificationToken,
}: {
  verificationToken: string;
}) => (
  <Html>
    <Head />
    <Preview>Verify your email address</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>Verify Your Email Address</Heading>
        <Text style={text}>
          Thank you for signing up! Please use the verification token below to
          complete your registration:
        </Text>
        <Button
          style={button}
          href={`${process.env.FRONTEND_URL}/auth/verify?token=${verificationToken}`}
        >
          Verify Email
        </Button>
        <Text style={text}>
          If you didn&apos;t request this email, you can safely ignore it.
        </Text>
        <Text style={footer}>© 2023 YourApp. All rights reserved.</Text>
      </Container>
    </Body>
  </Html>
);

export default VerificationEmail;

const main = {
  backgroundColor: "#f6f9fc",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  padding: "20px 0 48px",
  marginBottom: "64px",
};

const h1 = {
  color: "#333",
  fontSize: "24px",
  fontWeight: "bold",
  textAlign: "center" as const,
  margin: "30px 0",
};

const text = {
  color: "#333",
  fontSize: "16px",
  lineHeight: "26px",
  textAlign: "center" as const,
};

const button = {
  backgroundColor: "#5469d4",
  borderRadius: "4px",
  color: "#fff",
  fontSize: "16px",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "block",
  width: "230px",
  margin: "30px auto",
  padding: "10px 20px",
};

const footer = {
  color: "#8898aa",
  fontSize: "12px",
  lineHeight: "16px",
  textAlign: "center" as const,
  marginTop: "60px",
};
