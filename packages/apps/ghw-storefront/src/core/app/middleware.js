/*
 ** Copyright (c) 2021 Oracle and/or its affiliates.
 */

import {parseMetaData} from './metadata-parser';
import * as indexHtml from './index.html';

/**
 * Create middleware to extract application specific information from the request and
 * put it into the state.
 *
 * @param {import('express').Application} app The express application instance
 * @returns {[import('express').RequestHandler]}
 */
export default app => {
  // Pass `index.html` customization to SSR middleware
  app.locals.indexHtml = indexHtml;

  return {
    setStateFromRequest(req, res, next) {
      if (req.url.includes('__api')) {
        const {
          meta,
          options: {appName, getOriginAppName}
        } = req.app.locals;

        // Ensure `additionalState` is an array
        if (!Array.isArray(res.locals.additionalState)) {
          res.locals.additionalState = [];
        }

        const state = parseMetaData(meta, appName, getOriginAppName);

        res.locals.additionalState.push(state);
      }
      /*
      //
      //  WARNING
      //
      //  This example is purely illustrative. You will need to decide the specifics on what
      //  is extracted from the request and when it need to be inserted into the state.
      //
      const {additionalState = []} = res.locals;

      // Extract something from the request
      const {someQueryParam} = req.query;

      // Push that into the state.
      additionalState.push({
        clientRepository: {
          context: {
            global: {
              someQueryParam
            }
          }
        }
      });
      */
      next();
    }
  };
};
