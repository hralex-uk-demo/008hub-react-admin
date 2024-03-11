export class HttpBackendService {
  
    hubAPIEndpoint = 'https://gb-008hub-demo.appspot.com/portal/admin';
    insertAPIEndpoint = 'https://eu-west-2.aws.data.mongodb-api.com/app/data-yebmz/endpoint/investa_mongodb_insert';
    updateAPIEndpoint = 'https://eu-west-2.aws.data.mongodb-api.com/app/data-yebmz/endpoint/investa_mongodb_update';
    deleteAPIEndpoint = 'https://eu-west-2.aws.data.mongodb-api.com/app/data-yebmz/endpoint/investa_mongodb_delete';

    apiKey = '?apiKey=2b1b02b0a6b64bc9b817cfd414148795';

    async searchData(requestBody: any) {
      console.log('searchData() method called > requestBody > ', requestBody);
 
      const response = await fetch(this.hubAPIEndpoint , {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const responseData = await response.json();
      console.log("received response from server > responseData > ", responseData.data.businesses);
      return responseData.data.businesses;
  }

    async fetchData(endpointOperation: any) {
        console.log('fetchData() method called > endpointOperation > ', endpointOperation);

        const requestBody = { endpoint :  endpointOperation};

        const response = await fetch(this.hubAPIEndpoint , {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestBody),
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const responseData = await response.json();
        console.log("received response from server > fetchData > ", responseData.data.categories);
        return responseData.data.categories;
    }

    async fetchSubCategories(endpointOperation: any, categoryId: any) {
        console.log('fetchSubCategories() method called > endpointOperation > ', endpointOperation);

        const requestBody = { endpoint :  endpointOperation, categoryDocId: categoryId};

        console.log('fetchSubCategories() requestBody > ', requestBody);

        const response = await fetch(this.hubAPIEndpoint , {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestBody),
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const responseData = await response.json();
        console.log("received response from server > fetchData > ", responseData);
        console.log("received response from server > fetchData > ", responseData.data.subCategories);
        return responseData.data.subCategories;
    }

    async insertDocument(newDocumentJSON: any) {
        console.log('insertDocument() method called > tablename > ', newDocumentJSON);

        const response = await fetch(this.hubAPIEndpoint , {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newDocumentJSON),
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const responseData = await response.json();
        console.log("received response from server > insertDocument > ", responseData);
        return responseData;
    }
  

    async updateDocument(updateDocumentJSON: any) {
      console.log('updateDocument() method called > tablename > ', updateDocumentJSON);

      const response = await fetch(this.hubAPIEndpoint  , {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateDocumentJSON),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const responseData = await response.json();
      console.log("received response from server > insertDocument > ", responseData);
      return responseData;
    }

  async deleteDocument(updateDocumentJSON: any) {
      console.log('deleteDocument() method called > tablename > ', updateDocumentJSON);

      const response = await fetch(this.hubAPIEndpoint , {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateDocumentJSON),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const responseData = await response.json();
      console.log("received response from server > deleteDocument > ", responseData);
      return responseData;
  }

}
