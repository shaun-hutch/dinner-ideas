import React from "react";
import ContentLoader from "react-content-loader";

const FoodItemContentLoader = () => (
  <div>
    <ContentLoader
      speed={2}
      width={500}
      height={100}
      viewBox="0 0 200 100"
      backgroundColor="#f3f3f3"
      foregroundColor="#ecebeb"
    >
      <rect x="0" y="4" rx="3" ry="3" width="410" height="6" />
      <rect x="0" y="20" rx="3" ry="3" width="380" height="6" />
      <rect x="0" y="36" rx="3" ry="3" width="178" height="6" />
      <rect x="70" y="22" rx="0" ry="0" width="4" height="2" />
    </ContentLoader>
  </div>
);

export default FoodItemContentLoader;
