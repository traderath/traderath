"""Create identity tables independently of application model evolution."""
from alembic import op
import sqlalchemy as sa

revision = "0001_identity"
down_revision = None
branch_labels = None
depends_on = None


def identity_columns():
    return [sa.Column("id", sa.Uuid(), primary_key=True),
            sa.Column("created_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now())]


def upgrade():
    op.create_table("users", *identity_columns(),
        sa.Column("email", sa.String(320), nullable=False),
        sa.Column("password_hash", sa.String(512), nullable=False),
        sa.Column("is_active", sa.Boolean(), nullable=False, server_default="true"),
        sa.Column("email_verified", sa.Boolean(), nullable=False, server_default="false"))
    op.create_index("uq_users_email_lower", "users", [sa.text("lower(email)")], unique=True)
    op.create_table("organizations", *identity_columns(), sa.Column("name", sa.String(200), nullable=False))
    op.create_table("memberships", *identity_columns(),
        sa.Column("organization_id", sa.Uuid(), sa.ForeignKey("organizations.id", ondelete="RESTRICT"), nullable=False),
        sa.Column("user_id", sa.Uuid(), sa.ForeignKey("users.id", ondelete="RESTRICT"), nullable=False),
        sa.Column("role", sa.String(32), nullable=False),
        sa.UniqueConstraint("organization_id", "user_id", name="uq_membership_org_user"),
        sa.CheckConstraint("role IN ('owner','admin','operations','compliance_reviewer','finance','viewer')", name="ck_membership_role"))
    op.create_index("ix_memberships_organization_id", "memberships", ["organization_id"])
    op.create_index("ix_memberships_user_id", "memberships", ["user_id"])
    op.create_table("sessions", *identity_columns(),
        sa.Column("user_id", sa.Uuid(), sa.ForeignKey("users.id", ondelete="CASCADE"), nullable=False),
        sa.Column("token_hash", sa.String(64), nullable=False, unique=True),
        sa.Column("expires_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("revoked_at", sa.DateTime(timezone=True)),
        sa.CheckConstraint("expires_at > created_at", name="ck_session_expiry"))
    op.create_index("ix_sessions_user_id", "sessions", ["user_id"])
    op.create_index("ix_sessions_expires_at", "sessions", ["expires_at"])


def downgrade():
    for table in ("sessions", "memberships", "organizations", "users"):
        op.drop_table(table)
