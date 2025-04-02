import BaseGrid from "@/components/BaseGrid";

const RestaurantPage = ({ params }: { params: { id: string } }) => {
  return (
    <BaseGrid header={undefined}>
      <div>{params.id}</div>
    </BaseGrid>
  );
};

export default RestaurantPage;
