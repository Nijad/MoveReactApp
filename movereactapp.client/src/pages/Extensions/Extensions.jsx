import { useState } from "react";
import {
  AxiosProvider,
  Request,
  Get,
  Delete,
  Head,
  Post,
  Put,
  Patch,
  withAxios,
} from "react-axios";
function Extensions() {
  const [extensions, setExtensions] = useState([]);
  return (
    <div>
      <h1>Extensions Page</h1>
      <div>
        <Get
          url="https://localhost:7203/api/Extensions" /*params={{ id: "12345" }}*/
        >
          {(error, response, isLoading, makeRequest /*, axios*/) => {
            if (error) {
              return (
                <div>
                  Something bad happened: {error.message}{" "}
                  <button
                    onClick={() => makeRequest({ params: { reload: true } })}
                  >
                    Retry
                  </button>
                </div>
              );
            } else if (isLoading) {
              return <div>Loading...</div>;
            } else if (response !== null) {
              //console.log(response.data);
              //setExtensions([...response.data]);
              console.log(response.data);
              return (
                <div>
                  <button
                    onClick={() => makeRequest({ params: { refresh: true } })}
                  >
                    Refresh
                  </button>
                </div>
              );
            }
            return <div>Default message before request is made.</div>;
          }}
        </Get>
      </div>
    </div>
  );
}

export default Extensions;
