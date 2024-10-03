import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import * as React from "react";

interface ResetPasswordEmailProps {
  userFirstName: string;
  resetPasswordLink: string;
}

export const ResetPasswordEmail = ({
  userFirstName,
  resetPasswordLink,
}: ResetPasswordEmailProps) => (
  <Html>
    <Head />
    <Preview>Reset your password for your account</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>Password Reset Request</Heading>
        <Text style={text}>Hello {userFirstName},</Text>
        <Text style={text}>
          We received a request to reset the password for your account. If you
          didn&apos;t make this request, you can safely ignore this email.
        </Text>
        <Section style={buttonContainer}>
          <Button style={button} href={resetPasswordLink}>
            Reset Password
          </Button>
        </Section>
        <Text style={text}>
          This password reset link will expire in 1 hour. If you need to request
          a new password reset, please visit our website and submit another
          reset request.
        </Text>
        <Hr style={hr} />
        <Text style={footer}>
          If you&apos;re having trouble clicking the password reset button, copy
          and paste the URL below into your web browser:
        </Text>
        <Link href={resetPasswordLink} style={reportLink}>
          {resetPasswordLink}
        </Link>
      </Container>
    </Body>
  </Html>
);

export default ResetPasswordEmail;

const main = {
  backgroundColor: "#ffffff",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const container = {
  margin: "0 auto",
  padding: "20px 0 48px",
  width: "560px",
};

const h1 = {
  color: "#333",
  fontSize: "24px",
  fontWeight: "bold",
  paddingTop: "32px",
  paddingBottom: "32px",
};

const text = {
  color: "#333",
  fontSize: "16px",
  lineHeight: "26px",
};

const buttonContainer = {
  padding: "27px 0 27px",
};

const button = {
  backgroundColor: "#5e6ad2",
  borderRadius: "3px",
  fontWeight: "600",
  color: "#fff",
  fontSize: "16px",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "block",
  padding: "15px 30px",
};

const hr = {
  borderColor: "#cccccc",
  margin: "20px 0",
};

const footer = {
  color: "#8898aa",
  fontSize: "12px",
  marginTop: "12px",
};

const reportLink = {
  color: "#b4becc",
  fontSize: "14px",
  textDecoration: "underline",
};
