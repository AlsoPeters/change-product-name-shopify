import { useState } from 'react';
import {
  Card,
  Heading,
  TextContainer,
  DisplayText,
  TextStyle,
  Frame,
  Loading,
  Thumbnail,
} from '@shopify/polaris';
import { Toast } from '@shopify/app-bridge-react';
import { useAppQuery, useAuthenticatedFetch } from '../hooks';

export function ProductsCard() {
  const emptyToastProps = { content: null };
  const [isLoading, setIsLoading] = useState(true);
  const [toastProps, setToastProps] = useState(emptyToastProps);
  const fetch = useAuthenticatedFetch();

  // productName should start as the product that was queried
  const [productName, setProductName] = useState('Default Product Name');

  const {
    data,
    refetch: refetchProductCount,
    isLoading: isLoadingProducts,
    isRefetching: isRefetchingCount,
  } = useAppQuery({
    url: '/api/products/get',
    reactQueryOptions: {
      onSuccess: () => {
        setIsLoading(false);
      },
    },
  });

  console.log(data);
  const toastMarkup = toastProps.content && !isRefetchingCount && (
    <Toast {...toastProps} onDismiss={() => setToastProps(emptyToastProps)} />
  );

  const handlePopulate = async () => {
    setIsLoading(true);
    const response = await fetch('/api/products/create');

    if (response.ok) {
      await refetchProductCount();
      setToastProps({ content: '5 products created!' });
    } else {
      setIsLoading(false);
      setToastProps({
        content: 'There was an error creating products',
        error: true,
      });
    }
  };

  return (
    <div style={{ height: '100px' }}>
      <Frame>
        {toastMarkup}

        <Card
          title='Change the Name of Your Products'
          sectioned
          primaryFooterAction={{
            content: 'Populate 5 products',
            onAction: handlePopulate,
            loading: isLoading,
          }}
        >
          <TextContainer spacing='loose'>
            <div>
              {isLoadingProducts ? (
                <Loading />
              ) : (
                <>
                  <h1>{productName}</h1>
                  <Thumbnail
                    source='https://burst.shopifycdn.com/photos/black-leather-choker-necklace_373x@2x.jpg'
                    alt='Black choker necklace'
                    size='large'
                  />
                  <input
                    onChange={(e) => {
                      setProductName(e.target.value);
                      console.log(productName);
                    }}
                  ></input>
                </>
              )}
            </div>
          </TextContainer>
        </Card>
      </Frame>
    </div>
  );
}
