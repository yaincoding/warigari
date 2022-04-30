"use strict";

import { Client } from "@elastic/elasticsearch";

const es = new Client({
  node: {
    url: new URL("http://localhost:9200"),
  },
});

export const searchImage = async (feature_vector, fieldName) => {
  const result = await es.search({
    index: "fashion",
    query: {
      script_score: {
        query: {
          bool: {
            must: {
              exists: {
                field: fieldName
              }
            }
          }
        },
        script: {
          source: `cosineSimilarity(params.query_vector, '${fieldName}') + 1.0`,
          params: {
            query_vector: feature_vector,
          },
        },
      },
    },
  });

  return result.hits.hits;
};
