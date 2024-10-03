import * as React from "react";
import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Text,
  Hr,
  Img,
} from "@react-email/components";

interface OtpEmailProps {
  otp: string;
  username: string;
}

export default function OtpEmail({
  otp = "123456",
  username = "User",
}: OtpEmailProps) {
  return (
    <Html>
      <Head />
      <Body style={main}>
        <Container style={container}>
          <Img
            src={`https://react.email/static/icons/react.png`}
            width="42"
            height="42"
            alt="React"
            style={logo}
          />
          <Text style={paragraph}>Hi {username},</Text>
          <Text style={paragraph}>
            Your one-time password (OTP) for account verification is:
          </Text>
          <Section style={otpContainer}>
            <Text style={otpText}>{otp}</Text>
          </Section>
          <Text style={paragraph}>
            This OTP is valid for 10 minutes. Please do not share this code with
            anyone.
          </Text>
          <Hr style={hr} />
          <Text style={footer}>
            If you didn&apos;t request this OTP, please ignore this email or
            contact our support team if you have any concerns.
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

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

const logo = {
  margin: "0 auto",
};

const paragraph = {
  fontSize: "16px",
  lineHeight: "26px",
};

const otpContainer = {
  padding: "24px 0",
};

const otpText = {
  fontSize: "36px",
  fontWeight: "bold",
  textAlign: "center" as const,
  letterSpacing: "4px",
};

const hr = {
  borderColor: "#cccccc",
  margin: "20px 0",
};

const footer = {
  color: "#8898aa",
  fontSize: "12px",
};
