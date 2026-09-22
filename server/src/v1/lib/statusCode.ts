export enum status {
  Accepted = 202,
  AccessDenied = 403,
  BadRequest = 400,
  Conflict = 409,
  Created = 201,
  NoContent = 204,
  NotFound = 404,
  ServerError = 500,
  Success = 200,
  Unauthorized = 401,
}

// 100	Continue – The server received the request headers and expects the body.
// 101	Switching Protocols – The client has requested a protocol change (e.g., from HTTP to WebSocket).
// 102	Processing – The server is working on the request but hasn't completed it yet.
// 103	Early Hints – The server is sending some headers before the final response.

// 200	OK – The request was successful.
// 201	Created – A new resource was successfully created (e.g., after a POST request).
// 202	Accepted – The request was received but is still being processed.
// 203	Non-Authoritative Information – The response is from a different source than the original server.
// 204	No Content – The request was successful, but there’s no response body.
// 205	Reset Content – The request was successful, and the client should reset the view.
// 206	Partial Content – The response includes only part of the requested resource (used in range requests).

// 300	Multiple Choices – The request has multiple possible responses (e.g., multiple file formats).
// 301	Moved Permanently – The resource has been permanently moved to a new URL.
// 302	Found (Temporary Redirect) – The resource is temporarily available at a different URL.
// 303	See Other – The response is available at a different URL, should use GET to access it.
// 304	Not Modified – The resource has not changed (used for caching).
// 307	Temporary Redirect – Similar to 302 but preserves the request method (POST remains POST).
// 308	Permanent Redirect – Similar to 301 but preserves the request method.

// 400	Bad Request – The request is invalid or malformed.
// 401	Unauthorized – Authentication is required or failed.
// 402	Payment Required – Reserved for future use (often used in paid APIs).
// 403	Forbidden – The server understands the request but refuses to authorize it.
// 404	Not Found – The requested resource could not be found.
// 405	Method Not Allowed – The HTTP method used is not allowed for this resource.
// 406	Not Acceptable – The request format is not supported.
// 407	Proxy Authentication Required – Authentication is required through a proxy.
// 408	Request Timeout – The server timed out waiting for the request.
// 409	Conflict – The request conflicts with the current state of the resource.
// 410	Gone – The resource is permanently deleted and no longer available.
// 411	Length Required – The request must include a valid Content-Length header.
// 412	Precondition Failed – The request does not meet the server’s conditions.
// 413	Payload Too Large – The request body is too large to process.
// 414	URI Too Long – The request URL is too long for the server to handle.
// 415	Unsupported Media Type – The request has an unsupported content format.
// 416	Range Not Satisfiable – The requested range is invalid or not available.
// 417	Expectation Failed – The server cannot meet the Expect header requirements.
// 418	I'm a Teapot – A joke response (RFC 2324).

// 500	Internal Server Error – A generic error message when the server fails.
// 501	Not Implemented – The server does not support the request method.
// 502	Bad Gateway – The server received an invalid response from an upstream server.
// 503	Service Unavailable – The server is temporarily overloaded or down for maintenance.
// 504	Gateway Timeout – The upstream server did not respond in time.
// 505	HTTP Version Not Supported – The server does not support the HTTP version used in the request.
