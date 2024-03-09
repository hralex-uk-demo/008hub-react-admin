import { ApolloClient, InMemoryCache, HttpLink, gql } from '@apollo/client';

export class GraphQLService {
  
    // Replace with your AWS AppSync API URL
    stocksAPIEndpoint = 'https://p54xjue5bfcj3fhhhzlbpqyn4i.appsync-api.eu-north-1.amazonaws.com/graphql';

    // Replace with your API Key
    apiKey = 'da2-2nzixozykne4laba25cnhriay4';

    httpLink = new HttpLink({
      uri: this.stocksAPIEndpoint,
      headers: {
        'x-api-key': this.apiKey,
      },
    });

    client = new ApolloClient({
      link: this.httpLink,
      cache: new InMemoryCache(),
    });

    async fetchStocksData() {

      console.log('fetchStocksData() method called');

      try {
        const response = await this.client.query({
          query: gql`
          query listInvestaStocks {
            listInvestaStocks {
              items {
                id
                stockSymbol
                companyName
                currencySymbol
                exchangeCode
                sectorName
                sharePrice
                status
              }
            }
          }          
          `,
        });

        console.log('fetchStocksData() response >', response);
  
        const stocksList = response.data.listInvestaStocks.items;
        console.log('Stocks List:', stocksList);
        return stocksList;
      } catch (error) {
        console.error('Error fetching stocks list:', error);
      }
    }

    async createStock(stockDataToCreate: any) {
      try {
        const response = await this.client.mutate({
          // Define the mutation using template literals
          mutation: gql`
            mutation createInvestaStocks($createinvestastocksinput: CreateInvestaStocksInput!) {
              createInvestaStocks(input: $createinvestastocksinput) {
                id
                stockSymbol
                companyName
                currencySymbol
                sectorName
                exchangeCode
                sharePrice
                status
              }
            }
          `,
          variables: {
            // Pass the updated data here
            createinvestastocksinput: stockDataToCreate.createinvestastocksinput,
          },
        });
        // Log the response for debugging purposes
        console.log("Create Stock response:", response);
    
        // Handle the response as needed
      } catch (error) {
        console.error("Error creating stock:", error);
      }
    }

    async updateStock(stockDataToUpdate: any) {
      try {
        const { data } = await this.client.mutate({
          mutation: gql`
            mutation UpdateInvestaStock($input: UpdateInvestaStocksInput!) {
              updateInvestaStocks(input: $input) {
                id
                stockSymbol
                companyName
                currencySymbol
                sectorName
                exchangeCode
                sharePrice
                status
              }
            }
          `,
          variables: {
            input: stockDataToUpdate.updateinvestastocksinput,
          },
        });
    
        // Check if the mutation was successful and data is not null
        if (data && data.updateInvestaStocks) {
          const updatedStock = data.updateInvestaStocks;
          console.log('Update Stock response:', updatedStock);
          // Handle the updatedStock data as needed
          return updatedStock;
        } else {
          console.error('Error updating stock: Mutation response is empty.');
          // Handle the error appropriately
        }
      } catch (error) {
        console.error('Error updating stock:', error);
        // Handle the error appropriately
      }
    }
   
    async deleteStock(stockIdToDelete: any) {

      console.log("deleteStock() method called from GraphQL > ", stockIdToDelete)
      try {
        const response = await this.client.mutate({
          // Define the mutation using template literals
          mutation: gql`
            mutation deleteInvestaStocks($deleteinvestastocksinput: DeleteInvestaStocksInput!) {
              deleteInvestaStocks(input: $deleteinvestastocksinput) {
                id
              }
            }
          `,
          variables: {
            // Pass the data to be deleted here
            deleteinvestastocksinput: {
              id: stockIdToDelete, // Pass the ID of the item you want to delete
            },
          },
        });
    
        // Log the response for debugging purposes
        console.log("Delete Stock response:", response);
    
        // Handle the response as needed
      } catch (error) {
        console.error("Error deleting stock:", error);
      }
  }

}
