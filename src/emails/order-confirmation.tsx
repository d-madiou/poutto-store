import {
  Body,
  Column,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Row,
  Section,
  Text,
} from "@react-email/components";

export interface OrderConfirmationProps {
  orderRef: string;
  customerName: string;
  items: { name: string; quantity: number; price: number }[];
  total: number;
  paymentMethod: string; // "CASH" | "ORANGE_MONEY"
  deliveryAddress: string;
  orangeMoneyNumber?: string;
}

const fmt = (n: number) =>
  `${new Intl.NumberFormat("fr-FR").format(n)} ${process.env.NEXT_PUBLIC_CURRENCY ?? "GNF"}`;

export default function OrderConfirmationEmail({
  orderRef,
  customerName,
  items,
  total,
  paymentMethod,
  deliveryAddress,
  orangeMoneyNumber,
}: OrderConfirmationProps) {
  return (
    <Html lang="fr">
      <Head />
      <Preview>Votre commande {orderRef} est bien enregistrée</Preview>
      <Body style={body}>
        <Container style={container}>
          <Text style={brand}>POUTOU STORE</Text>
          <Heading style={h1}>Merci, {customerName} !</Heading>
          <Text style={p}>
            Votre commande <strong>#{orderRef}</strong> est bien enregistrée. Nous la
            préparons avec soin au Fouta-Djallon.
          </Text>

          <Section style={box}>
            {items.map((item, i) => (
              <Row key={i} style={{ marginBottom: 8 }}>
                <Column>
                  <Text style={itemName}>
                    {item.name} × {item.quantity}
                  </Text>
                </Column>
                <Column align="right">
                  <Text style={itemPrice}>{fmt(item.price * item.quantity)}</Text>
                </Column>
              </Row>
            ))}
            <Hr style={hr} />
            <Row>
              <Column>
                <Text style={totalLabel}>Total</Text>
              </Column>
              <Column align="right">
                <Text style={totalValue}>{fmt(total)}</Text>
              </Column>
            </Row>
          </Section>

          <Text style={p}>
            <strong>Livraison :</strong> {deliveryAddress}
          </Text>

          {paymentMethod === "ORANGE_MONEY" ? (
            <Section style={notice}>
              <Text style={noticeText}>
                <strong>Paiement Orange Money.</strong> Envoyez {fmt(total)} au{" "}
                <strong>{orangeMoneyNumber ?? "numéro communiqué par le vendeur"}</strong> en
                indiquant la référence #{orderRef}. Nous confirmerons votre paiement dès
                réception.
              </Text>
            </Section>
          ) : (
            <Section style={notice}>
              <Text style={noticeText}>
                <strong>Paiement en espèces à la livraison.</strong> Préparez {fmt(total)}, à
                régler à la remise du colis.
              </Text>
            </Section>
          )}

          <Hr style={hr} />
          <Text style={footer}>
            Une question ? Répondez à cet e-mail ou écrivez-nous sur WhatsApp.
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
const h1 = { fontSize: "24px", color: "#1c1a2e", margin: "0 0 8px" };
const p = { fontSize: "15px", lineHeight: "24px", color: "#3d3a4d", margin: "8px 0" };
const box = {
  backgroundColor: "#f6f4ee",
  borderRadius: "8px",
  padding: "16px 20px",
  margin: "20px 0",
};
const itemName = { fontSize: "14px", color: "#1c1a2e", margin: 0 };
const itemPrice = { fontSize: "14px", color: "#1c1a2e", margin: 0 };
const totalLabel = { fontSize: "15px", fontWeight: 700, color: "#1c1a2e", margin: 0 };
const totalValue = { fontSize: "15px", fontWeight: 700, color: "#2b2a72", margin: 0 };
const hr = { borderColor: "#e4e0d4", margin: "12px 0" };
const notice = {
  border: "1px solid #d9c48a",
  backgroundColor: "#fbf6e8",
  borderRadius: "8px",
  padding: "4px 16px",
  margin: "16px 0",
};
const noticeText = { fontSize: "14px", lineHeight: "22px", color: "#5c4a17", margin: "10px 0" };
const footer = { fontSize: "13px", color: "#8a8598", margin: "8px 0 0" };
