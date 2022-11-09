import { Shopify } from '@shopify/shopify-api';

const UPDATE_PRODUCTS_MUTATION = `
  mutation productUpdate(input: {id: "gid://shopify/Product/7986223776017", title: "Sweet new product - GraphQL Edition"}) {
    productCreate(input: $input) {
      product {
        id
      }
    }
  }
`;

export default async function productCreator(session) {
  const client = new Shopify.Clients.Graphql(session.shop, session.accessToken);

  try {
    await client.query({
      data: {
        query: UPDATE_PRODUCTS_MUTATION,
        variables: {
          input: {
            title: `${productName}`,
          },
        },
      },
    });
  } catch (error) {
    if (error instanceof Shopify.Errors.GraphqlQueryError) {
      throw new Error(
        `${error.message}\n${JSON.stringify(error.response, null, 2)}`
      );
    } else {
      throw error;
    }
  }
}
