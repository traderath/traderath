"""Identity tables; authentication/authorization behavior is implemented separately."""
from datetime import datetime
from uuid import UUID, uuid4

from sqlalchemy import Boolean, CheckConstraint, DateTime, ForeignKey, Index, String, UniqueConstraint, func
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column


class Base(DeclarativeBase):
    pass


class IdentityMixin:
    id: Mapped[UUID] = mapped_column(primary_key=True, default=uuid4)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())


class User(IdentityMixin, Base):
    __tablename__ = "users"
    email: Mapped[str] = mapped_column(String(320), nullable=False)
    password_hash: Mapped[str] = mapped_column(String(512), nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean, server_default="true")
    email_verified: Mapped[bool] = mapped_column(Boolean, server_default="false")
    __table_args__ = (Index("uq_users_email_lower", func.lower(email), unique=True),)


class Organization(IdentityMixin, Base):
    __tablename__ = "organizations"
    name: Mapped[str] = mapped_column(String(200), nullable=False)


class Membership(IdentityMixin, Base):
    __tablename__ = "memberships"
    organization_id: Mapped[UUID] = mapped_column(ForeignKey("organizations.id", ondelete="RESTRICT"), index=True)
    user_id: Mapped[UUID] = mapped_column(ForeignKey("users.id", ondelete="RESTRICT"), index=True)
    role: Mapped[str] = mapped_column(String(32))
    __table_args__ = (
        UniqueConstraint("organization_id", "user_id", name="uq_membership_org_user"),
        CheckConstraint("role IN ('owner','admin','operations','compliance_reviewer','finance','viewer')",
                        name="ck_membership_role"),
    )


class AuthSession(IdentityMixin, Base):
    __tablename__ = "sessions"
    user_id: Mapped[UUID] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), index=True)
    token_hash: Mapped[str] = mapped_column(String(64), unique=True)
    expires_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), index=True)
    revoked_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    __table_args__ = (CheckConstraint("expires_at > created_at", name="ck_session_expiry"),)
