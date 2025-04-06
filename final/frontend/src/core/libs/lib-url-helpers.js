import queryString from 'query-string'

export function getQueryParams() {
  const queryParams = queryString.parse(window.location.search)
  const queryParamKeys = Object.entries(queryParams)
  const cleanedQueryParams = {}

  /* Remove any redundant double quotes by parsing */
  for (let i = 0; i < queryParamKeys.length; i += 1) {
    const key = queryParamKeys[i][0]
    const value = JSON.parse(queryParamKeys[i][1])
    cleanedQueryParams[key] = value
  }

  return cleanedQueryParams
}
