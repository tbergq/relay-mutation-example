// @flow

import { graphql, commitMutation } from '@kiwicom/relay';

import type { ToggleFavoriteMutationVariables } from './__generated__/ToggleFavoriteMutation.graphql';

const mutation = graphql`
  mutation ToggleFavoriteMutation($serieId: ID!, $add: Boolean!) {
    toggleFavorite(serieId: $serieId, add: $add) {
      success
      serieId
      tvShow {
        node {
          id
          ...FavoritesItem_data
        }
      }
    }
  }
`;

const parentID = 'client:root';
const connectionKey = 'FavoritesList_favorites';
const configs = [
  {
    type: 'RANGE_ADD',
    parentID,
    connectionInfo: [
      {
        key: connectionKey,
        rangeBehavior: 'prepend',
      },
    ],
    edgeName: 'tvShow',
  },
  {
    type: 'RANGE_DELETE',
    parentID,
    connectionKeys: [
      {
        key: connectionKey,
      },
    ],
    pathToConnection: [parentID, 'favorites'],
    deletedIDFieldName: 'serieId',
  },
];

const toggle = (
  environment: $FlowFixMe,
  { serieId, add }: ToggleFavoriteMutationVariables,
  onCompleted: ?() => void,
) => {
  commitMutation(environment, {
    mutation,
    variables: { serieId, add },
    onCompleted,
    onError: () => alert('Toggle favorite failed'),
    configs,
    updater: store => {
      const serie = store.get(serieId);

      if (serie) {
        serie.setValue(add, 'isFavorite');
      }
    },
  });
};

export default toggle;