import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Preview,
  Text,
} from "@react-email/components";

export interface BroadcastProps {
  subject: string;
  message: string; // texte brut, les sauts de ligne sont préservés
  siteUrl: string;
}

export default function BroadcastEmail({ subject, message, siteUrl }: BroadcastProps) {
  return (
    <Html lang="fr">
      <Head />
      <Preview>{subject}</Preview>
      <Body style={body}>
        <Container style={container}>
          <Text style={brand}>POUTOU STORE</Text>
          <Heading style={h1}>{subject}</Heading>
          {message.split("\n").map(
            (line, i) =>
              line.trim() !== "" && (
                <Text key={i} style={p}>
                  {line}
                </Text>
              )
          )}
          <Hr style={hr} />
          <Text style={footer}>
            <Link href={siteUrl} style={link}>
              Visiter la boutique
            </Link>{" "}
            · Vous recevez cet e-mail car vous êtes client de Poutou Store.
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

const body = { backgroundColor: "#f6f4ee", fontFamily: "Georgia, 'Times New Roman', serif" };
const container = {
  backgroundColor: "#ffffff",
  margin: "24px auto",
  padding: "32px",
  maxWidth: "520px",
  borderRadius: "12px",
  borderTop: "6px solid #2b2a72",
};
const brand = {
  fontSize: "12px",
  letterSpacing: "3px",
  color: "#2b2a72",
  fontWeight: 700,
  margin: "0 0 16px",
};
const h1 = { fontSize: "22px", color: "#1c1a2e", margin: "0 0 8px" };
const p = { fontSize: "15px", lineHeight: "24px", color: "#3d3a4d", margin: "8px 0" };
const hr = { borderColor: "#e4e0d4", margin: "20px 0 12px" };
const footer = { fontSize: "12px", color: "#8a8598", margin: 0 };
const link = { color: "#2b2a72", textDecoration: "underline" };
