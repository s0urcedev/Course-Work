import 'isomorphic-fetch';
import { Client } from '@microsoft/microsoft-graph-client';
import { TokenCredentialAuthenticationProvider } from '@microsoft/microsoft-graph-client/authProviders/azureTokenCredentials';
import { ClientSecretCredential } from '@azure/identity';
import { settings } from '../settings';

export function getGraphUser(id, organization) {
    const client = Client.initWithMiddleware({
        authProvider: new TokenCredentialAuthenticationProvider(
            new ClientSecretCredential(settings[organization].tenantId, settings[organization].clientId, settings[organization].clientSecret),
            {
                scopes: ['https://graph.microsoft.com/.default']
            }
        )
    });
    return client.api(`/users/${id}`)
        .select(['displayName', 'mail', 'userPrincipalName', 'id'])
        .get();
}