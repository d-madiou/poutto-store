import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Text,
} from "@react-email/components";

export interface OrderStatusUpdateProps {
  orderRef: string;
  customerName: string;
  status: "SHIPPED" | "DELIVERED";
}

const MESSAGES = {
  SHIPPED: {
    title: "Votre commande est en route",
    body: "Votre poutou a quitté l'atelier et se dirige vers vous. Le livreur vous contactera au numéro indiqué lors de la commande.",
  },
  DELIVERED: {
    title: "Votre commande est livrée",
    body: "Votre poutou est arrivé à destination. Nous espérons qu'il vous accompagnera longtemps — n'hésitez pas à nous envoyer une photo sur WhatsApp !",
  },
} as const;

export default function OrderStatusUpdateEmail({
  orderRef,
  customerName,
  status,
}: OrderStatusUpdateProps) {
  const msg = MESSAGES[status];
  return (
    <Html lang="fr">
      <Head />
      <Preview>{msg.title} — commande #{orderRef}</Preview>
      <Body style={body}>
        <Container style={container}>
          <Text style={brand}>POUTOU STORE</Text>
          <Heading style={h1}>{msg.title}</Heading>
          <Text style={p}>Bonjour {customerName},</Text>
          <Text style={p}>
            {msg.body} (Référence : <strong>#{orderRef}</strong>)
          </Text>
          <Text style={footer}>Merci de votre confiance.</Text>
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
const footer = { fontSize: "13px", color: "#8a8598", margin: "16px 0 0" };
