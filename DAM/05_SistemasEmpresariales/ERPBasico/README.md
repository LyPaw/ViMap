## Material de Estudio

El temario oficial completo de este modulo esta disponible en el siguiente archivo PDF local:

- [Temario: ERP (PDF)](../temario_erp.pdf)

# Sistemas de Gestion Empresarial - ERP

## Conceptos fundamentales

Un ERP (Enterprise Resource Planning) es un sistema integrado de software que gestiona los procesos de negocio de una empresa.

### Modulos tipicos de un ERP

1.  **Finanzas**: contabilidad, cuentas a pagar/cobrar, libro mayor, activos fijos.
2.  **Compras**: solicitudes de compra, pedidos a proveedores, recepcion de mercancia.
3.  **Ventas**: presupuestos, pedidos de cliente, facturacion, cobros.
4.  **Inventario**: control de stock, almacenes, movimientos de producto.
5.  **RRHH**: nominas, contratos, expedientes de empleados.
6.  **Produccion**: ordenes de fabricacion, listas de materiales, planificacion.
7.  **CRM**: gestion de relaciones con clientes, oportunidades, incidencias.

### Arquitectura de un ERP

-   **Base de datos relacional**: almacenamiento centralizado de datos.
-   **Capa de negocio**: logica de la aplicacion (servicios, reglas de negocio).
-   **Capa de presentacion**: interfaz de usuario (web, escritorio, movil).
-   **API / Integraciones**: conexion con sistemas externos.

### Flujo de trabajo tipico (Ciclo de venta)

Cliente -> Pedido -> Validacion stock -> Preparacion -> Envio -> Factura -> Cobro

### Patrones de diseno en ERP

-   **DAO (Data Access Object)**: separa la logica de acceso a datos.
-   **Service Layer**: logica de negocio encapsulada en servicios.
-   **DTO (Data Transfer Object)**: objetos para transferencia de datos entre capas.
-   **Repository**: abstraccion del almacenamiento de datos.

## Ejercicios propuestos

1.  Completa el sistema ERP basico anadiendo un modulo de inventario con control de stock minimo.
2.  Implementa un modulo de facturacion que genere el numero de factura secuencial por ano.
3.  Anade una capa de persistencia JPA a las entidades del sistema.
4.  Implementa un sistema de descuentos por volumen y por cliente VIP.
5.  Crea un informe de ventas mensual que agrupe por producto y cliente.

