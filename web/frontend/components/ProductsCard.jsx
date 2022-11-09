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
  const [productName, setProductName] = useState('');

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

  const handleUpdate = async () => {
    setIsLoading(true);
    let productData = {
      id: data?.data?.edges[0]?.node?.id,
      title: productName,
    };
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ productData }),
    };

    const response = await fetch('/api/products/update', options);

    console.log(await response.json());
    if (response.ok) {
      await refetchProductCount();
      setToastProps({ content: 'Products updated!' });
    } else {
      setIsLoading(false);
      setToastProps({
        content: 'There was an error updating products',
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
            content: 'Update products',
            onAction: handleUpdate,
            loading: isLoading,
          }}
        >
          <TextContainer spacing='loose'>
            <div>
              {isLoadingProducts ? (
                <Loading />
              ) : (
                <>
                  <h1>{data.data.edges[0].node.title}</h1>
                  <Thumbnail
                    source={data.data.edges[0].node.images.edges[0].node.url}
                    alt={data.data.edges[0].node.title}
                    size='large'
                  />
                  <input
                    placeholder={data.data.edges[0].node.title}
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
