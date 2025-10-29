import { Container } from "@/components/ui/container";
import { Heading } from "@/components/ui/heading";
import { TourCard } from "@/components/sections/tour-card";

export default function HomePage() {
  const mockTour = {
    name: "Экскурсия по историческому центру города",
    mainImage: null,
    shortDescription:
      "Погрузитесь в атмосферу исторического наследия города с нашим увлекательным туром по самым знаменитым достопримечательностям.",
    dates: "10-20 мая",
    price: {
      value: 4500,
      currency: "₽",
    },
  };

  return (
    <main className="min-h-screen py-8">
      <Container>
        <div className="space-y-8">
          <Heading as="h1">Главная страница</Heading>
          <div className="max-w-sm">
            <TourCard tour={mockTour} />
          </div>
        </div>
      </Container>
    </main>
  );
}
